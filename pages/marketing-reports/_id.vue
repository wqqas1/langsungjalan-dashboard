<template>
  <div>
    <h2 v-if="currentEdit" class="primary--text mb-2">Laporan Marketing</h2>    
    <v-tabs align-with-title color="primary" class="white elevation-1" dark>
      <v-tabs-slider color="white"/>
      <v-tab href="#detail">
        Detail
      </v-tab>
      <v-tab-item :id="'detail'">
        <detail-v2/>
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
import { MARKETING_REPORTS_URL, COMBO_DATA_URL } from "~/utils/apis"
import axios from "axios"
import { detail_v2 } from "~/components/marketing-reports"
import { global } from "~/mixins"
import catchError from "~/utils/catchError"

export default {
  async fetch({ store, params }) {
    try {
      let resp = await axios.get(MARKETING_REPORTS_URL + "/" + params.id)
      if (resp) store.commit("currentEdit", resp.data.data)

      let marketings = await axios.get(COMBO_DATA_URL + "MarketingAll")
      if (marketings) store.commit("comboData", marketings.data)

      let actions = await axios.get(COMBO_DATA_URL + "Action")
      if (actions) store.commit("comboData2", actions.data)
    } catch (e) {
      catchError(e)
    }
  },
  components: { "detail-v2": detail_v2 },
  mixins: [global]
}
</script>

<style scoped>
</style>
