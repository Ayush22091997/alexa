const express = require('express')
const Transactions = require('../models/transactions')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/transactions', auth, async (req, res) => {
    const transactions = new Transactions({
        ...req.body,
        owner: req.user._id
    })

    try {
        await transactions.save()
        res.status(201).send(transactions)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/transactions', auth, async (req, res) => {
    try {
        await req.user.populate('transactions').execPopulate()
        res.send(req.user.transactions)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/transactions/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const transactions = await Transactions.findOne({ _id, owner: req.user._id })

        if (!transactions) {
            return res.status(404).send()
        }

        res.send(transactions)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/transactions/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['amount']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const transactions = await Transactions.findOne({ _id: req.params.id, owner: req.user._id})

        if (!transactions) {
            return res.status(404).send()
        }

        updates.forEach((update) => transactions[update] = req.body[update])
        await transactions.save()
        res.send(transactions)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/transactions/:id', auth, async (req, res) => {
    try {
        const transactions = await Transactions.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!transactions) {
            res.status(404).send()
        }

        res.send(transactions)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
