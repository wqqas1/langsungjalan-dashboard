<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6>
          <v-card class="elevation-12">
            <v-toolbar>
              <v-toolbar-title>Login</v-toolbar-title>
              <v-spacer/>
            </v-toolbar>
            <v-card-text>
              <form>
                <v-text-field
                  v-validate="'required|email'"
                  v-model="email"
                  :error-messages="errors.collect('email')"
                  name="email"
                  prepend-icon="email"
                  label="E-mail Address"
                  data-vv-name="email"
                />

                <v-text-field
                  v-validate="'required'"
                  v-model="password"
                  :append-icon="e1 ? 'visibility_off' : 'visibility'"
                  :type="e1 ? 'text' : 'password'"
                  :error-messages="errors.collect('password')"
                  prepend-icon="lock"
                  name="password"
                  label="Enter your password"
                  hint="At least 6 characters"
                  min="6"
                />
              </form>
            </v-card-text>
            <v-card-actions>
              <v-btn flat @click="showResetForm = true"><span>Lupa Password ?</span></v-btn>
              <v-spacer/>
              <v-btn :loading="loading" :disabled="loading" @click="submit">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <EmailForm :show="showResetForm" @onClose="showResetForm = false"/>
  </v-content>
</template>

<script>
import Cookie from "js-cookie"
import { LOGIN_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import { global } from "~/mixins"
import EmailForm from "~/components/EmailForm"
export default {
  layout: "nonav",
  $_veeValidate: {
    validator: "new"
  },
  components: { EmailForm },
  mixins: [global],
  data: () => ({
    email: "super_administrator@langsungjalan.com",
    password: "P4sw0rd@langsungjalan.com",
    e1: false,
    loading: false,
    allowedLogin: ["super-administrator", "administrator"],
    showResetForm: false
  }),
  methods: {
    submit() {
      this.$validator.validateAll().then(result => {
        if (result) {
          this.doLogin()
          return
        }
      })
    },
    async doLogin() {
      try {
        this.loading = true
        let credential = {
          email: this.email,
          password: this.password
        }
        const resp = await axios
          .post(LOGIN_URL, credential)
          .then(res => res.data)
        if (resp.meta.status === 200) {
          let allowed = false
          let roles = resp.data.user.roles
          roles.forEach(r => {
            if (this.inArray(this.allowedLogin, r.slug)) allowed = true
          })
          if (allowed) {
            Cookie.set("lj_token", JSON.stringify(resp.data), { expires: 1 })
            this.$store.commit("user", resp.data.user)
            this.$store.commit("token", resp.data.token)
            // this.$store.commit("SET_LANG", resp.data.user.lang)

            this.$router.push("/")
          } else {
            this.loading = false
            showNoty("You are not authorized", "error")
          }
        } else {
          this.loading = false
          showNoty("Login failed", "error")
        }
      } catch (e) {
        this.loading = false
        catchError(e)
      }
    }
  }
}
</script>
