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
					<v-btn @click="obtener_roles()" small color="primary" text>Configuración</v-btn>
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
		campamento: {}
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
