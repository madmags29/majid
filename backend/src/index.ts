import app from './app';

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(Number(PORT), '127.0.0.1', () => {
        console.log(`Server is running on port ${PORT} (local only)`);
    });
}

export default app;
