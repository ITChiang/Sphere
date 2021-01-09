import {testfunction01} from '../components/test01'


test('Check the result of 5 + 2 ', () => {
    expect(testfunction01(5,2)).toBe(7)
})