const buttons = document.querySelectorAll('.controls > span')
const calculation = []
let result = null
const maxResultLength = 9
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
    const hasDot = calculation.findIndex(value => value === '.') > -1
    if (!calculation.length) calculation.push('0', '.')
    else if (!hasDot) calculation.push('.')
  }
}
buttons.forEach(button => button.addEventListener('click', onClick))
render()

function onClick(event) {
  const target = event.currentTarget
  const proxy = target.getAttribute('data-proxy')
  const value = proxy ? proxy : target.innerText
  const lastIsOperator = isOperator(calculation[calculation.length - 1])

  if (isOperator(value) && !calculation.length) return
  else if (isOperator(value) && lastIsOperator) calculation[calculation.length - 1] = value
  else if (isSpecialOperator(value)) specialOperators[value]()
  else if (isNumber(value) || isOperator(value)) calculation.push(value)

  result = calculator(calculation)
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
  return operators.findIndex(operator => operator === value) > -1
}
function isSpecialOperator(value) {
  return Object.keys(specialOperators).findIndex(operator => operator === value) > -1
}
function isNumber(value) {
  const specialNumbers = ['0', '00', 0]
  return specialNumbers.findIndex(number => number === value) > -1 || Number(value) > 0
}
function parseResult(result) {
  if (!isNumber(result)) return ''
  const _result = result.toPrecision(maxResultLength).toString()
  const sliced = _result.length > maxResultLength ? _result.slice(0, maxResultLength) : _result
  return Number(sliced)
}