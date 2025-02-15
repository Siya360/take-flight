// internal/middleware/logging.go

package middleware

import (
	"bytes"
	"io"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"go.uber.org/zap"
)

// LoggingConfig defines the config for logging middleware
type LoggingConfig struct {
	Logger          *zap.Logger
	Skipper         func(c echo.Context) bool
	LogRequestBody  bool
	LogResponseBody bool
}

// DefaultLoggingConfig returns the default logging config
func DefaultLoggingConfig() *LoggingConfig {
	return &LoggingConfig{
		Logger:          zap.L(),
		LogRequestBody:  false,
		LogResponseBody: false,
	}
}

type responseData struct {
	status int
	size   int64
	body   string
}

// Logger returns a middleware that logs HTTP requests
func Logger(config *LoggingConfig) echo.MiddlewareFunc {
	if config == nil {
		config = DefaultLoggingConfig()
	}
	if config.Logger == nil {
		config.Logger = zap.L()
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if config.Skipper != nil && config.Skipper(c) {
				return next(c)
			}

			start := time.Now()
			req := c.Request()
			res := c.Response()

			reqBody := captureRequestBody(config.LogRequestBody, req)
			resData := setupResponseCapture(config.LogResponseBody, res)

			err := next(c)

			logRequestResponse(c, config, start, reqBody, resData, err)
			return err
		}
	}
}

func captureRequestBody(shouldLog bool, req *http.Request) string {
	if !shouldLog || req.Body == nil {
		return ""
	}

	bodyBytes, _ := io.ReadAll(req.Body)
	req.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))
	return string(bodyBytes)
}

func setupResponseCapture(shouldLog bool, res *echo.Response) *responseData {
	data := &responseData{}

	if shouldLog {
		resBody := new(bytes.Buffer)
		writer := &bodyDumpResponseWriter{
			ResponseWriter: res.Writer,
			body:           resBody,
		}
		res.Writer = writer
		data.body = resBody.String()
	}

	return data
}

func logRequestResponse(c echo.Context, config *LoggingConfig, start time.Time, reqBody string, resData *responseData, err error) {
	req := c.Request()
	res := c.Response()

	fields := []zap.Field{
		zap.String("method", req.Method),
		zap.String("uri", req.RequestURI),
		zap.String("ip", c.RealIP()),
		zap.Int("status", res.Status),
		zap.Int64("size", res.Size),
		zap.Duration("latency", time.Since(start)),
		zap.String("user_agent", req.UserAgent()),
	}

	if reqBody != "" {
		fields = append(fields, zap.String("request_body", reqBody))
	}

	if resData.body != "" {
		fields = append(fields, zap.String("response_body", resData.body))
	}

	if err != nil {
		fields = append(fields, zap.Error(err))
	}

	logWithLevel(config.Logger, res.Status, fields)
}

func logWithLevel(logger *zap.Logger, status int, fields []zap.Field) {
	switch {
	case status >= 500:
		logger.Error("server error", fields...)
	case status >= 400:
		logger.Warn("client error", fields...)
	default:
		logger.Info("request completed", fields...)
	}
}

// bodyDumpResponseWriter captures the response body
type bodyDumpResponseWriter struct {
	http.ResponseWriter
	body *bytes.Buffer
}

func (w *bodyDumpResponseWriter) Write(b []byte) (int, error) {
	w.body.Write(b)
	return w.ResponseWriter.Write(b)
}
