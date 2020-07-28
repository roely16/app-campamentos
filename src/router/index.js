import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Registro from '../views/Registro.vue'
import ActivarCuenta from "../views/ActivarCuenta.vue";
import Home from '../views/Home.vue'
import Inicio from '../views/Inicio.vue'
import Pacientes from '../views/Pacientes.vue'
import ControlColas from '../views/ControlColas.vue'
import Farmacia from '../views/Farmacia.vue'
import ConsultaGeneral from '../views/ConsultaGeneral.vue'

// Privado
import ConsultaPrivado from '../views/Consulta_Privado'
import PretriajePrivado from '../views/Pretriaje_Privado'

Vue.use(VueRouter)

	const routes = [
	{
		path: '/',
		name: 'login',
		component: Login
	},
	{
		path: '/registro',
		name: 'registro',
		component: Registro
	},
	{
		path: '/control_colas',
		name: 'control_colas',
		component: ControlColas
	},
	{
		path: '/activar_cuenta/:id',
		name: 'activar_cuenta',
		component: ActivarCuenta
	},
	{
		path: '/home',
		name: 'home',
		component: Home,
		children: [
			{
				path: '/home/menu',
				name: 'inicio',
				component: Inicio,
			},
			{
				path: '/home/pacientes',
				name: 'pacientes',
				component: Pacientes,
			},
			{
				path: '/home/farmacia',
				name: 'farmacia',
				component: Farmacia,
			},
			{
				path: '/home/consulta_general',
				name: 'consulta_general',
				component: ConsultaGeneral,
			},
			// Privado
			{
				path: '/home/pacientes_privado',
				name: 'pacientes_privado',
				component: PretriajePrivado,
			},
			{
				path: '/home/consulta_privado',
				name: 'consulta_privado',
				component: ConsultaPrivado,
			},

		]
	},
  
]

const router = new VueRouter({
  routes
})

export default router
