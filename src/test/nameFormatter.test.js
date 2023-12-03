import Assert from 'assert'
import {nameFormatter} from '../../src/utils/nameFormatter.js'

const assert = Assert.strict

describe('nameFormatter', () => {
    it('Should format the name correctly', () => {
        const mockName = 'JUAN PEREZ'
        const formattedName = nameFormatter(mockName)
        assert.equal(formattedName, 'Juan Perez')
    })

})