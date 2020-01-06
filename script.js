const buttons = document.querySelectorAll('.controls > span')
const calculation = []
let result = null
const maxResultLength = 9
const maxCalculationLength = 20
const lastInputIsOperator = inputs => isOperator(inputs[inputs.length - 1])
const operatorIsRedundant = (inputs, value) => isOperator(value) && inputs.length && lastInputIsOperator(inputs)
const contains = (list, value) => list.findIndex(element => element === value) > -1
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
    if (!calculation.length) calculation.push('0', '.')
    else if (!contains(calculation, '.')) calculation.push('.')
  }
}
buttons.forEach(button => button.addEventListener('click', onClick))
render()

function onClick(event) {
  const target = event.currentTarget
  const proxy = target.getAttribute('data-proxy')
  const value = proxy ? proxy : target.innerText

  if (isSpecialOperator(value)) specialOperators[value]()
  else if (calculation.length >= maxCalculationLength) return alert('Max calculation Reached!')
  else if (operatorIsRedundant(calculation, value)) calculation[calculation.length - 1] = value
  else if (isOperator(value) || isNumber(value)) calculation.push(value)

  result = lastInputIsOperator(calculation) ? null : calculator(calculation)
  render()
}
function render() {
  document.getElementById('calculation').innerText = calculation.join('') || 'Calculator'
  document.getElementById('result').innerText = parseResult(result)
}

function calculator(calculation) {
  try {
    return eval(calculation
      .map(value => value === 'x' ? '*' : value)
      .join(''))
  } catch (e) { return null }
}

function isOperator(value) {
  const operators = ['x', '/', '+', '-']
  return contains(operators, value)
}
function isSpecialOperator(value) {
  return contains(Object.keys(specialOperators), value)
}
function isNumber(value) {
  const specialNumbers = ['0', 0]
  return contains(specialNumbers, value) || !!parseFloat(value)
}
function parseResult(result) {
  if (!isNumber(result)) return ''
  const _result = result.toPrecision(maxResultLength)
  const sliced = _result.length > maxResultLength ? _result.slice(0, maxResultLength) : _result
  return parseFloat(sliced)
}
