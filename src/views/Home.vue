<template>
	<v-app>

		<v-navigation-drawer temporary v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>

			<v-row class="mt-4" align="center" justify="center">
				<v-col cols="6">
					<v-img src="@/assets/user.png" contain></v-img>
				</v-col>
				<v-col class="text-center" cols="12">
					<h3>{{ userName }}</h3>
					<div class="text-subtitle-1">{{ userDependencia }}</div>
					<small>{{ userRol }}</small>
					
				</v-col>
				<v-col dense no-gutters cols="12" class="text-center pt-0 mt-0">
					<v-btn @click="campamentos_configuracion()" small color="primary" text>Configuración</v-btn>
					<v-divider></v-divider>
				</v-col>
			</v-row>

			<v-spacer></v-spacer>

			<v-list v-if="menu.length > 0" dense>

				<v-list-item
					:key="item.id"
					link
					v-for="item in menu"
					:to="{name: item.url}"
				>
					
					<v-list-item-action>
						<v-icon>{{ item.icono }}</v-icon>
					</v-list-item-action>
					<v-list-item-content>
						<v-list-item-title >
							{{ item.nombre }}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>

				<v-list-item @click="salir()" link>
					<v-list-item-action>
						<v-icon color="red darken-1">mdi-logout</v-icon>
					</v-list-item-action>
					<v-list-item-content color="red darken-1">
						<v-list-item-title >
							<span class="red--text" color="red darken-1">Salir</span>
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
				
			</v-list>

			<template v-slot:append>
				<div class="pa-2">
					<!-- <v-btn block>Logout</v-btn> -->
					<small>Versión {{ version }}</small>
				</div>
			</template>
		</v-navigation-drawer>

		<v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
			<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
			<v-toolbar-title style="width: 300px" class="ml-0 pl-4">
				<span>MEDIC-AVE</span>
			</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-img max-width="40" src="@/assets/logo_muni_circulo.png"></v-img>
			
			<v-img max-width="80" class="ml-2" src="@/assets/logoAve.png"></v-img>
		</v-app-bar>

		<v-main>
			<v-container fluid>
				<router-view></router-view>
			</v-container>
		</v-main>
		

		<v-dialog v-model="mostrar_configuracion" max-width="400">
		
			<v-card>

				<v-tabs>
					<v-tab>
						<v-icon>mdi-account-cog</v-icon>
					</v-tab>
					<v-tab>
						<v-icon>
							mdi-lock-open
						</v-icon>
					</v-tab>

					<v-tab-item>
						
						<v-card-title class="headline">Configuración</v-card-title>
						<v-card-text>
							<v-col class="d-flex" cols="12">
								<v-select
									v-model="campamento.id"
									:items="campamentos"
									label="Campamentos"
									item-text="nombre" item-value="id"
									hide-details
									outlined
								></v-select>
							</v-col>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="green darken-1" text @click="mostrar_configuracion = false">Cancelar</v-btn>
							<v-btn color="green darken-1" text @click="dialog = cambiar_campamento()">Aceptar</v-btn>
						</v-card-actions>

					</v-tab-item>

					<v-tab-item>
						
						<v-card-title class="headline">
							Cambiar Contraseña
						</v-card-title>

						<v-card-text>
							<v-form ref="form_cambio" v-model="valid_form_cambio">
								<v-col class="d-flex" cols="12">
									<v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="pass.actual" outlined label="Actual Contraseña" :append-icon="!pass.show_actual ? 'mdi-eye' : 'mdi-eye-off'" :type="pass.show_actual ? 'text' : 'password'" @click:append="pass.show_actual = !pass.show_actual" hide-details autocomplete="off"></v-text-field>
								</v-col>

								<v-col class="d-flex" cols="12">
									<v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="pass.nueva" outlined label="Nueva Contraseña" :append-icon="!pass.show_nueva ? 'mdi-eye' : 'mdi-eye-off'" :type="pass.show_nueva ? 'text' : 'password'" @click:append="pass.show_nueva = !pass.show_nueva" hide-details autocomplete="off"></v-text-field>
								</v-col>

								<v-col class="d-flex" cols="12">
									<v-text-field :rules="[v => !!v || 'Campo obligatorio!']" v-model="pass.repite_nueva" outlined label="Repite Nueva Contraseña" :append-icon="!pass.show_repite_nueva ? 'mdi-eye' : 'mdi-eye-off'" :type="pass.show_repite_nueva ? 'text' : 'password'" @click:append="pass.show_repite_nueva = !pass.show_repite_nueva" hide-details autocomplete="off"></v-text-field>
								</v-col>
							</v-form>

						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="green darken-1" text @click="mostrar_configuracion = false">Cancelar</v-btn>
							<v-btn color="green darken-1" text @click="dialog = cambiar_password()">Aceptar</v-btn>
						</v-card-actions>

					</v-tab-item>
				</v-tabs>

				


			</v-card>
		</v-dialog>

	</v-app>
</template>

<script>
// @ is an alias to /src

import Swal from 'sweetalert2'

export default {
	
	props: {
      source: String,
    },
    data: () => ({
		dialog: false,
		drawer: false,
		menu: [],
		campamentos: [],
		mostrar_configuracion: false,
		campamento: {},
		pass: {
			actual: null,
			show_actual: false,
			nueva: null,
			show_nueva: false,
			repite_nueva: null,
			show_repite_nueva: false
		},
		valid_form_cambio: true
	}),
	methods: {
		obtener_menu(){
			
			let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

			let data = {
				id: usuario.id
			}

			this.axios.post(process.env.VUE_APP_API_URL + 'obtener_menu.php', data)
			.then((response) => {
				this.menu = response.data
			})
		},
		salir(){

			let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

			let data = {

				id: usuario.id

			}

			this.axios.post(process.env.VUE_APP_API_URL + 'salir.php', data)
			.then((response) => {
				
				if (response.data) {
					
					localStorage.removeItem('usuario-campamentos')
					this.$router.push({ name: 'login' })

				}

			})


		},
		obtener_roles(){
			
			this.axios.get(process.env.VUE_APP_API_URL + 'datos_registro.php').then((response) => {
				this.campamentos = response.data.campamentos

				let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))
				this.campamento.id = usuario.id_campamento
				this.campamento.id_usuario = usuario.id
				this.mostrar_configuracion = true
			})

		},
		cambiar_campamento(){

			this.axios.post(process.env.VUE_APP_API_URL + 'actualizar_campamento.php', this.campamento)
			.then((response) => {

				if (response.data) {
					
					Swal.fire(
						'Excelente!',
						'Se ha actualizado el campamento.  Deberá inicar sesión de nuevo',
						'success'
					).then(() => {

						this.mostrar_configuracion = false
						this.salir()

					})

				}
				
			})
			

		},
		cambiar_password(){

			this.$refs.form_cambio.validate()

			if (this.valid_form_cambio) {
				
				if (this.pass.nueva == this.pass.repite_nueva) {

					// Verificar que la clave actual sea correcta, si lo es actualizar

					let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

					this.pass.id_usuario = usuario.id

					this.axios
					.post(process.env.VUE_APP_API_URL + 'actualizar_password.php', this.pass)
					.then((response) => {
						console.log(response.data)

						if (response.data.status == 200) {
							
							Swal.fire(
								'Excelente!',
								'Se ha actualizado la contraseña exitosamente.  Deberá inicar sesión de nuevo',
								'success'
							).then(() => {

								this.mostrar_configuracion = false
								this.salir()

							})

						}else{

							Swal.fire({
								icon: 'error',
								title: 'Error...',
								text: response.data.message,
							})

						}
					})

				}else{

					Swal.fire({
						icon: 'error',
						title: 'Error...',
						text: 'La nueva contraseñas debe de coincidir!',
					})

				}

			}

		},
		campamentos_configuracion(){

			let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

			let data = {
				id: usuario.id
			}

			this.axios.post(process.env.VUE_APP_API_URL + 'campamentos_configuracion.php', data)
			.then((response) => {
				console.log(response.data);

				this.campamentos = response.data.campamentos

				let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))
				this.campamento.id = usuario.id_campamento
				this.campamento.id_usuario = usuario.id
				this.mostrar_configuracion = true
			})

		}
	},
	computed:{

		userName: function(){

			let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

			return usuario.nombre + ' ' + usuario.apellido

		},
		userDependencia: function(){

			let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

			return usuario.campamento

		},
		userRol: function(){

			let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

			return usuario.rol

		},
		version: function(){

			return process.env.VUE_APP_VERSION

		}

	},
	mounted(){

		this.obtener_menu()

	}

}
</script>
