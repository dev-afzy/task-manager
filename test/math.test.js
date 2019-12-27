const {calculatetip, fahrenheitToCelsius, celsiusToFahrenheit, add} = require('../src/math')

test ('should calculate with total tip', ()=>expect(calculatetip(10, .2)).toBe(12))

test ('should calculate with total tip', ()=>expect(calculatetip(10)).toBe(12))

test ('fahrenheitToCelsius', ()=>expect(fahrenheitToCelsius(32)).toBe(0))

test ('celsiusTOFahrenheit', ()=>expect(celsiusToFahrenheit(0)).toBe(32))

test ('calculate sum', (done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5)
        done()
    })
})

test('calculate sum of two numbers', async()=> expect(await add(3,5)).toBe(8))