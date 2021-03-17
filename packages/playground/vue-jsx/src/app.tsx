import { defineComponent, ref } from 'vue'

export const App = defineComponent({
  name: 'app',
  setup() {
    const d = ref(0)
    return { d }
  },
  render() {
    return (
      <>
        <div>{this.d}</div>
      </>
    )
  }
})
