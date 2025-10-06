<template>
  <div class="buttons">
    <button @click="undo" :disabled="!service.canUndo">Undo</button>
    <button @click="redo" :disabled="!service.canRedo">Redo</button>
  </div>

  <DayPilotScheduler
      ref="schedulerRef"
      :timeHeaders="timeHeaders"
      scale="Day"
      :days="days"
      :startDate="startDate"
      :durationBarVisible="false"
      :eventHeight="34"
      :resources="resources"
      :events="events"
      @timeRangeSelected="onTimeRangeSelected"
      @eventMoved="onEventMoved"
      @eventResized="onEventResized"
      @eventDeleted="onEventDeleted"
      @beforeEventRender="onBeforeEventRender"
  />

  <h2>History</h2>
  <div
      v-for="(item, i) in service?.history"
      :key="i"
      :class="{ highlighted: service.position === i }"
      class="history-item"
  >
    [{{ i }}] {{ item.type }} - {{ item.text }}
  </div>
  <div :class="{ highlighted: service.history.length && service.position === service.history.length }"></div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { DayPilot, DayPilotScheduler } from '@daypilot/daypilot-lite-vue'
import { UndoService } from '@/undo/UndoService'

const service = reactive(new UndoService())

const schedulerRef = ref(null)
const scheduler = computed(() => schedulerRef.value?.control)

const timeHeaders = [{ groupBy: 'Month' }, { groupBy: 'Day', format: 'd' }]
const days = 31
const startDate = '2026-08-01'

const resources = ref([])
const events = ref([])

const onTimeRangeSelected = async (args) => {
  const modal = await DayPilot.Modal.prompt('Create a new event:', 'Event 1')
  scheduler.value.clearSelection()
  if (modal.canceled) {
    return
  }

  const data = {
    start: args.start,
    end: args.end,
    id: DayPilot.guid(),
    resource: args.resource,
    text: modal.result
  }
  scheduler.value.events.add(data)
  service.add(data, 'New event created')
}

const onEventMoved = (args) => {
  service.update(args.e.data, 'Event moved')
}

const onEventResized = (args) => {
  service.update(args.e.data, 'Event resized')
}

const onEventDeleted = (args) => {
  service.remove(args.e.data, 'Event removed')
}

const onBeforeEventRender = (args) => {
  args.data.areas = [
    {
      top: 5,
      right: 5,
      width: 24,
      height: 24,
      padding: 3,
      symbol: '/icons/daypilot.svg#x-2',
      backColor: '#ed9337',
      fontColor: '#fff',
      style: 'border-radius: 50%;',
      onClick: (clickArgs) => {
        const event = clickArgs.source
        scheduler.value.events.remove(event)
        service.remove(event.data, 'Event removed')
      }
    }
  ]
}

const loadEvents = () => {
  const list = [
    { id: 1, start: '2026-08-03T00:00:00', end: '2026-08-08T00:00:00', text: 'Event 1', resource: 'R4' },
    { id: 2, start: '2026-08-04T00:00:00', end: '2026-08-10T00:00:00', text: 'Event 2', resource: 'R2' }
  ]
  events.value = list
  service.initialize(list)
}

const loadResources = () => {
  resources.value = [
    { name: 'Resource 1', id: 'R1' },
    { name: 'Resource 2', id: 'R2' },
    { name: 'Resource 3', id: 'R3' },
    { name: 'Resource 4', id: 'R4' },
    { name: 'Resource 5', id: 'R5' },
    { name: 'Resource 6', id: 'R6' },
    { name: 'Resource 7', id: 'R7' }
  ]
}

const undo = () => {
  const item = service.undo()
  if (!item) return

  switch (item.type) {
    case 'add':
      scheduler.value.events.remove(item.id)
      break
    case 'remove':
      scheduler.value.events.add(item.previous)
      break
    case 'update':
      scheduler.value.events.update(item.previous)
      break
  }
}

const redo = () => {
  const item = service.redo()
  if (!item) return

  switch (item.type) {
    case 'add':
      scheduler.value.events.add(item.current)
      break
    case 'remove':
      scheduler.value.events.remove(item.id)
      break
    case 'update':
      scheduler.value.events.update(item.current)
      break
  }
}

onMounted(() => {
  loadResources()
  loadEvents()
})
</script>



<style>

body .scheduler_default_event_inner {
  border-radius: 25px;
  background: #ffcc99;
  color: #333;
  border: 1px solid #ed9337;
  padding: 5px;
}

body .scheduler_default_event {
  border-radius: 25px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scheduler_default_shadow {
  border-radius: 25px;
}

.scheduler_default_shadow_inner {
  border-radius: 25px;
  background: #ffcc99;
  color: #333;
  border: 1px solid #ed9337;
  padding: 5px;
}

</style>

<style scoped>
h2 {
  margin-top: 10px;
  margin-bottom: 30px;
  padding-top: 10px;
}

.history-item {
  background-color: #f9f9f9;
  border: 1px solid #e0e0e0;
  padding: 10px;
  margin-bottom: 4px;
  border-radius: 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.highlighted {
  position: relative;
  margin-top: 20px;
}

.highlighted::before {
  content: 'Position';
  position: absolute;
  left: 20px;
  top: -20px;
  color: #3c78d8;
  font-size: 14px;
}

.highlighted::after {
  content: '';
  position: absolute;
  left: 5px;
  top: -15px;
  width: 10px;
  height: 10px;
  background-color: #3c78d8;
  border-radius: 50%;
}

.buttons {
  margin-bottom: 10px;
  display: inline-flex;
}

.buttons button {
  background-color: #3c78d8;
  color: white;
  border: 0;
  padding: .5rem 1rem;
  width: 80px;
  cursor: pointer;
  margin-right: 1px;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.08);
  box-sizing: border-box;
}

.buttons button:last-child {
  margin-right: 0;
}

.buttons button.selected {
  background-color: #1c4587;
  box-shadow: 0 3px 5px rgba(0,0,0,0.1);
}

.buttons button:disabled {
  background-color: #d3d3d3;
  color: #333;
  cursor: not-allowed;
}

.buttons button:first-child {
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

.buttons button:last-child {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
}

.buttons button:not(:disabled):hover {
  background-color: #2f66c4;
  box-shadow: 0 5px 7px rgba(0,0,0,0.1);
}

.buttons button:active {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

</style>
