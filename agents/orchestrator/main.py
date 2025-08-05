from fastapi import FastAPI

app = FastAPI()

@app.get('/health')
async def health() -> dict[str, str]:
    return {'status': 'ok'}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8080)
