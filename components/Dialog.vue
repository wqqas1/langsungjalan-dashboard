<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card color="primary" dark>
        <v-card-title>
          <span class="headline">{{ text }}</span>
        </v-card-title>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="white primary--text" light @click="onClose" >Tidak</v-btn>
          <v-btn color="white primary--text" light @click="onConfirmed" >Ya</v-btn>          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  watch: {
    showDialog() {
      if (this.showDialog || !this.showDialog) {
        this.dialog = this.showDialog
      }
    }
  },
  methods: {
    onClose() {
      this.$emit("onClose")
    },
    onConfirmed() {
      this.$emit("onConfirmed")
    }
  }
}
</script>

<style scoped>
</style>
