import {Router} from "express";
import routerProd from './products.routes.js';
import routerCart from './cart.routes.js';
import routerUser from './users.routes.js';
import routerMessage from './messages.routes.js';
import routerSessions from './sessions.routes.js';
import routerMailing from './mail.routes.js';
import routerTicket from './tickets.routes.js';
import routerMock from './mocks.routes.js';
import routerHandlebars from './handlebars.routes.js';



const router = Router()

router.use('/api/products',routerProd)
router.use('/api/carts', routerCart);
router.use('/api/messages', routerMessage)
router.use('/api/users', routerUser)
router.use('/api/sessions', routerSessions)
router.use('/api/mail', routerMailing);
router.use('/api/tickets', routerTicket);
router.use('/api/mockingproducts', routerMock);
router.use('/static', routerHandlebars);


export default router;