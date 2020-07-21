<template>
	<div>
	<v-row align="center" justify="center">
		<v-col xs="12" md="6" sm="8" lg="12">
			<v-form ref="login_form" v-model="valid_form" justify="center">
				<v-text-field v-model="usuario.telefono" :rules="[v => !!v || 'Campo obligatorio!']" dark outlined label="Usuario" prepend-icon="mdi-account" type="text" autocomplete="off"></v-text-field>
				<!-- <v-text-field dark outlined label="Contraseña" prepend-icon="mdi-lock" type="password"></v-text-field> -->
				<v-row dense class="text-center">
					<v-col>
						<v-btn @click="login" dark x-large color="success">Aceptar 
							<v-icon>
								mdi-login
							</v-icon>
						</v-btn>
					</v-col>
				</v-row>

				<v-row class="mt-6" justify="center" dense>
					<v-col cols="10">
						<v-alert class="text-center" v-if="loginError" dense type="error">
							Teléfono Incorrecto.
						</v-alert>
					</v-col>
				</v-row>

			</v-form>
		</v-col>
	</v-row>

	<v-dialog
      v-model="dialog"
      max-width="290"
		:persistent="sendingMail"
    >
      <v-card>
        <v-card-title class="headline">Activación de Cuenta</v-card-title>

        <v-card-text>
			
			<div v-if="!mailSend">
				Su cuenta se encuentra pendiente de activación y no podra ingresar hasta que lo haga.
			</div>

			<v-alert class="mt-4" v-if="mailSend" dense text type="success">
				El correo de activación a sido enviado correctamente.
			</v-alert>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="gray darken-1"
            text
            @click="dialog = false"
			:disabled="sendingMail"
          >
            {{ mailSend ? 'Cerrar' : 'Cancelar'}}
          </v-btn>

          <v-btn
            color="red darken-1"
            text
			:loading="sendingMail"
			@click="reenviarCorreo"
			v-if="!mailSend"
			
          >
            Reenviar Correo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

	</div>
	
</template>

<script>
    export default {
        data(){
			return{
				valid_form: true,
				usuario: {},
				loginError: false,
				dialog: false,
				sendingMail: false,
				usuario_registrado: {},
				mailSend: false
			}
		},   
		methods: {
            login(){
				
				this.$refs.login_form.validate()
				
				if (this.valid_form) {
					
					this.loginError = false
					this.mailSend = false

					this.axios.post(process.env.VUE_APP_API_URL + 'login.php', this.usuario).then((response) => {
						
						if (!response.data) {
							
							this.loginError = true

						}else{

							if (response.data.verificada) {
								
								console.log(response.data)

								localStorage.setItem('usuario-campamentos', JSON.stringify(response.data))

								this.$router.push({ name: 'inicio' })


							}else{

								this.usuario_registrado = response.data

								this.dialog = true

							}

						}
                    })
					

				}

			},
			reenviarCorreo(){

				this.sendingMail = true

				console.log(this.usuario_registrado)

				this.axios.post(process.env.VUE_APP_API_URL + 'reenviar_correo.php', this.usuario_registrado)
				.then((response) => {

					console.log(response.data)
					this.sendingMail = false
					// this.dialog = false
					this.mailSend = true

				})

			}
		}    
    }
</script>