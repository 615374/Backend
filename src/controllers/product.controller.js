import productModel from "../models/products.models.js";
import CustomError from "../services/errors/customError.js";
import EErrors from '../services/errors/enums.js';
import { generateProductErrorInfo } from '../services/errors/info.js';

export const getProducts = async (req, res) => {
    const { limit, page, sort, category } = req.query

    const pag = page ? page : 1
    const lim = limit ? limit : 10
    const ord = sort == 'asc' ? 1 : -1
    const filter = category ? {category: category} : {};

    try {
        const products = await productModel.paginate({ filter: filter }, {
            limit: lim,
            page: pag, 
            sort: { price: ord } })

        if (products) {
            return res.status(200).send(products)
        }

        res.status(404).send({ error: "Productos no encontrados" })

    } catch (error) {
        res.status(500).send({ error: `Error en consultar productos ${error}` })
    }

}

export const getProduct = async (req, res) => {
    const { id } = req.params
    try {
        const product = await productModel.findById(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en consultar producto ${error}` })
    }
}

export const postProduct = async (req, res) => {

    const { title, description, code, price, stock, category } = req.body

    if ((!title || !description || !code || !price || !stock || !category)) {
		CustomError.createError({
			name: 'Error de creación de producto',
			cause: generateProductErrorInfo({ title, description, code, price, stock, category }),
			message: 'Error al crear producto',
			code: EErrors.MISSING_OR_INVALID_PRODUCT_DATA,
		});
	}

    try {
        const product = await productModel.create({ title, description, code, price, stock, category })

        if (product) {
            return res.status(201).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send({ error: `Llave duplicada` })
        } else {
            return res.status(500).send({ error: `Error en consultar producto ${error}` })
        }

    }
}

export const putProduct = async (req, res) => {
    const { id } = req.params
    const { title, description, code, price, stock, category } = req.body

   if ((!title || !description || !code || !price || !stock || !category)) {
		CustomError.createError({
			name: 'Error de actualización de producto',
			cause: generateProductErrorInfo({
				title,
				description,
				code,
				price,
				stock,
				category,
			}),
			message: 'Error al actualizar producto',
			code: EErrors.MISSING_OR_INVALID_PRODUCT_DATA,
		});
	}
   

    try {
        const product = await productModel.findByIdAndUpdate(id, { title, description, code, price, stock, category })

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en actualizar producto ${error}` })
    }
}

export const deleteProduct = async (req, res) => {
    const { id } = req.params

    try {
        const product = await productModel.findByIdAndDelete(id)

        if (product) {
            return res.status(200).send(product)
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en eliminar producto ${error}` })
    }
}