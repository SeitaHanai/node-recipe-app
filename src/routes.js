const express = require('express')
const { getDbConnection } = require('./database')
const errorHandler = require('./utils/errorHandler')

const router = express.Router()

router.get('/', (req, res) => {
	res.render('home', { title: 'Recipe App' })
})

router.get('/recipes', errorHandler(async (req, res) => {
	const db = await getDbConnection()
	const recipes = await db.all('SELECT * FROM recipes')
	res.render('recipes', { recipes })
}))

router.get('/recipes/:id', errorHandler(async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const recipe = await db.get('SELECT * FROM recipes WHERE id = ?', [recipeId])
	if (!recipe) {
		return res.status(404).render('recipe', { recipe: null })
	}
	res.render('recipe', { recipe })
}))

router.delete('/recipes/:id', errorHandler(async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const recipe = await db.get('SELECT * FROM recipes WHERE id = ?', [recipeId])
	if (!recipe) {
		return res.status(404).render('recipe', { recipe: null })
	}
	await db.run('DELETE FROM recipes WHERE id = ?', [recipeId])
	res.redirect('/recipes')
}))

router.post('/recipes', errorHandler(async (req, res) => {
	const db = await getDbConnection()
	const { title, ingredients, method } = req.body
	if (!title || !title.trim()) {
		const recipes = await db.all('SELECT * FROM recipes')
		return res.status(400).render('recipes', { recipes, error: 'Title is required' })
	}
	await db.run('INSERT INTO recipes (title, ingredients, method) VALUES (?, ?, ?)', [title, ingredients, method])
	res.redirect('/recipes')
}))

router.post('/recipes/:id/edit', errorHandler(async (req, res) => {
	const db = await getDbConnection()
	const recipeId = req.params.id
	const { title, ingredients, method } = req.body
	await db.run('UPDATE recipes SET title = ?, ingredients = ?, method = ? WHERE id = ?', [
		title,
		ingredients,
		method,
		recipeId,
	])
	res.redirect(`/recipes/${recipeId}`)
}))

module.exports = router
