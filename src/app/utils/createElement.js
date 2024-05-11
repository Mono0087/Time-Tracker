/*
  name: string
  classList: [string, ...]
  id: string
  textContent: string
  children: [childElement, ...]
  datasetArray: [{dataKey: string dataValue: string||boolean||number}, ...]
  ...attrs: [{key: string, value: string||boolean||number}]

  EXAMPLE OF USE:

  const someElement = createElement('div', null, null, 'hi')

    const el = createElement(
      'div',
      ['content-el'],
      null,
      'hello there!',
      [someElement],
      [
        { dataKey: 'hi', dataValue: 'there' },
        { dataKey: 'me' },
      ],
      { key: 'style', value: 'background-color:red' },
    )
    container.appendChild(el)
 */
export default function createElement(
  name,
  classList,
  id,
  children,
  textContent,
  datasetArray,
  ...attrs
) {
  const el = document.createElement(name)
  if (classList) el.classList.add(...classList)
  if (id) el.id = id
  if (textContent) el.innerText = textContent
  if (children) {
    children.forEach((child) => {
      const newChild = child.cloneNode(true)
      el.appendChild(newChild)
    })
  }
  if (datasetArray) {
    datasetArray.forEach((dataObj) => {
      el.dataset[dataObj.dataKey] = dataObj.dataValue
    })
  }
  attrs.forEach((attr) => {
    el.setAttribute(attr.key, attr.value ?? '')
  })
  return el
}
