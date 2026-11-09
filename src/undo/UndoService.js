import {DayPilot} from "@daypilot/daypilot-lite-vue"

export class UndoService {

  _items = Object.create(null)
  _history = []
  _position = 0

  get history() {
    return this._history
  }

  get position() {
    return this._position
  }

  get canUndo() {
    return this._position > 0
  }

  get canRedo() {
    return this._position < this._history.length
  }

  initialize(items) {
    // deep copy using JSON serialization/deserialization
    this._items = Object.create(null)
    items.forEach(i => {
      let str = JSON.stringify(i)
      let key = this.keyForItem(i)
      if (this._items[key]) {
        throw "Duplicate IDs are not allowed."
      }
      this._items[key] = str
    })

    this._history = []
    this._position = 0
  }

  update(item, text) {
    let key = this.keyForItem(item)
    let stringified = JSON.stringify(item)
    if (!this._items[key]) {
      throw "The item to be updated was not found in the list."
    }
    if (this._items[key] === stringified) {
      throw "The item to be updated has not been modified."
    }
    let record = {
      id: item.id,
      time: new DayPilot.Date(),
      previous: JSON.parse(this._items[key]),
      current: JSON.parse(stringified),
      text: text,
      type: "update"
    }

    this._items[key] = stringified
    this.addToHistory(record)

    return record
  }

  add(item, text) {
    let key = this.keyForItem(item)
    if (this._items[key]) {
      throw "Item is already in the list"
    }
    let record = {
      id: item.id,
      time: new DayPilot.Date(),
      previous: null,
      current: JSON.parse(JSON.stringify(item)),
      text: text,
      type: "add"
    }

    this._items[key] = JSON.stringify(item)
    this.addToHistory(record)

    return record
  }

  remove(item, text) {
    let key = this.keyForItem(item)
    if (!this._items[key]) {
      throw "The item to be removed was not found in the list."
    }
    if (this._items[key] !== JSON.stringify(item)) {
      throw "The item to be removed has been modified."
    }
    let record = {
      id: item.id,
      time: new DayPilot.Date(),
      previous: JSON.parse(this._items[key]),
      current: null,
      text: text,
      type: "remove"
    }

    this._items[key] = null
    this.addToHistory(record)

    return record
  }

  undo() {
    if (!this.canUndo) {
      return null
    }

    this._position -= 1
    let record = this._history[this._position]

    let key = this.keyForId(record.id)
    switch (record.type) {
      case "add":
        this._items[key] = null
        break
      case "remove":
        this._items[key] = JSON.stringify(record.previous)
        break
      case "update":
        this._items[key] = JSON.stringify(record.previous)
        break
    }

    return JSON.parse(JSON.stringify(record))
  }

  redo() {
    if (!this.canRedo) {
      return null
    }

    let record = this._history[this._position]
    this._position += 1

    let key = this.keyForId(record.id)
    switch (record.type) {
      case "add":
        this._items[key] = JSON.stringify(record.current)
        break
      case "remove":
        this._items[key] = null
        break
      case "update":
        this._items[key] = JSON.stringify(record.current)
        break
    }

    return JSON.parse(JSON.stringify(record))
  }

  keyForItem(item) {
    return this.keyForId(item.id)
  }

  keyForId(id) {
    return "_" + id
  }

  addToHistory(record) {
    while (this.canRedo) {
      this._history.pop()
    }
    this._history.push(record)
    this._position += 1
  }

}
