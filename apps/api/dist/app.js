import express from 'express';
import cors from 'cors';
import { getAccountInfo } from './controllers/account.controller.js';
import { PORT } from './config.js';
import { BlockchainService } from './services/blockchain.service.js';
const app = express();
// Middleware
app.use(cors()); // Allow Frontend to access this API
app.use(express.json());
// Routes
app.get('/api/account/:address', getAccountInfo);
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
});
app.get('/api/token/:address', async (req, res) => {
    try {
        const blockchainService = new BlockchainService();
        const data = await blockchainService.getTokenData(req.params.address);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});
//# sourceMappingURL=app.js.map