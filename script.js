const buttons = document.querySelectorAll('.controls > span')
const calculation = []
let result = null
const maxResultLength = 9
const maxCalculationLength = 20
const lastInputIsOperator = inputs => isOperator(last(inputs))
const operatorIsRedundant = (inputs, value) => 
  isOperator(value) && inputs.length && lastInputIsOperator(inputs)
const zeroIsRedundant = (inputs, value) => isNumber(value) && lastNumber(inputs) === '0'
const operators = ['x', '/', '+', '-']

const specialOperators = {
  '='() {
    calculation.length = 0
    result && calculation.push(result)
  },
  'C'() {
    calculation.length = 0
    result = null
  },
  'back'() {
    calculation.pop()
  },
  '.'() {
    if (!calculation.length || lastInputIsOperator(calculation)) calculation.push('0', '.')
    else if (!lastNumber(calculation).includes('.')) calculation.push('.')
  }
}
const onClick = (event) => {
  const target = event.currentTarget
  const proxy = target.getAttribute('data-proxy')
  const value = proxy ? proxy : target.innerText

  if (isSpecialOperator(value)) specialOperators[value]()
  else if (calculation.length >= maxCalculationLength) return alert('Max calculation Reached!')
  else if (operatorIsRedundant(calculation, value) || zeroIsRedundant(calculation, value))
    calculation[calculation.length - 1] = value
  else if (isOperator(value) && last(calculation) === '.') calculation.push('0', value)
  else if (isOperator(value) || isNumber(value)) calculation.push(value)

  result = lastInputIsOperator(calculation) ? null : calculator(calculation)
  render()
}
const render = () => {
  document.getElementById('calculation').innerText = calculation.join('') || 'Calculator'
  document.getElementById('result').innerText = parseResult(result)
}

const calculator = (calculation) => {
  try {
    return eval(calculation.join('').replace('x', '*'))
  } catch (e) { return null }
}

const isOperator = (value) => operators.includes(value)
const isSpecialOperator = (value) => Object.keys(specialOperators).includes(value)
const isNumber = (value) => {
  const specialNumbers = ['0', 0]
  return specialNumbers.includes(value) || !!parseFloat(value)
}
const parseResult = (result) => {
  if (!isNumber(result)) return ''
  const _result = result.toPrecision(maxResultLength)
  const sliced = _result.length > maxResultLength ? _result.slice(0, maxResultLength) : _result
  return parseFloat(sliced)
}
const lastNumber = (calculation = []) => 
  last(calculation.join('').split(new RegExp(`\\${operators.join('|\\')}`)))
const last = (array) => array[array.length - 1]

const init = () => {
  buttons.forEach(button => button.addEventListener('click', onClick))
  render()
}
init()
