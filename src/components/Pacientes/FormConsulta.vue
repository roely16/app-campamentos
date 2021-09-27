<template>
    <div>
        <v-row justify="center">
			<v-dialog fullscreen hide-overlay v-model="show_dialog" @click:outside="closeDialog()">

				<v-card>
					<v-toolbar dark color="blue darken-4">
						<v-btn icon dark @click="closeDialog()">
							<v-icon>mdi-close</v-icon>
						</v-btn>
						<v-toolbar-title>
							{{ obtener_detalle ? 'DETALLE PACIENTE ' + paciente.correlativo : 'NUEVO PACIENTE' }}
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-toolbar-items v-if="usuario">
							<v-btn :disabled="!usuario.editar_paciente" dark text @click="obtener_detalle ? editar_paciente() : registrar_paciente()">
								<v-icon>mdi-content-save</v-icon>
							</v-btn>
						</v-toolbar-items>
					</v-toolbar>

					<v-card-text>
						<v-container>
							<v-tabs v-if="usuario" class="mb-2" v-model="tab">
								<v-tab :key="0">Datos Personales</v-tab>
								<v-tab v-if="usuario.ver_bitacora_consulta" :key="1">Bítacora de Consulta</v-tab>
							</v-tabs>
							<v-tabs-items v-model="tab">
								<v-tab-item :key="0">
									<v-form ref="form_paciente" v-model="valid_form">
										<v-row v-if="usuario" align="center">
											<v-col cols="12">
												<span class="headline">Datos Generales</span>
												<v-divider></v-divider>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" :rules="[v => !!v || 'Campo obligatorio!']" v-model="paciente.nombre" label="Primer Nombre" hide-details outlined required></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off"  v-model="paciente.segundo_nombre" label="Segundo Nombre" hide-details outlined required></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" :rules="[v => !!v || 'Campo obligatorio!']" v-model="paciente.apellido" label="Primer Apellido" hide-details outlined></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.segundo_apellido" label="Segundo Apellido" hide-details outlined></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.dpi" label="DPI" hide-details outlined></v-text-field>
											</v-col>

											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.cui" label="Código Único de Identificación (APLICA CASO DE MENORES DE EDAD)" hide-details outlined></v-text-field>
											</v-col>

											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.pasaporte" label="Número de Pasaporte" hide-details outlined></v-text-field>
											</v-col>

											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.afiliacion_igss" label="Afiliación IGSS" hide-details outlined></v-text-field>
											</v-col>

											<v-col cols="12" sm="6" md="6">
												<v-radio-group class="mt-0" :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" :rules="[v => !!v || 'Campo obligatorio!']" v-model="paciente.genero" hide-details row>
													<template v-slot:label>
														<div>
															<strong>Género: </strong>
														</div>
														<br>
													</template>
													<br>
													<v-radio label="Masculino" value="M"></v-radio>
													<v-radio label="Femenino" value="F"></v-radio>
												</v-radio-group>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-menu
													ref="menu"
													v-model="menu"
													:close-on-content-click="false"
													transition="scale-transition"
													offset-y
													min-width="290px"
												>
													<template v-slot:activator="{ on, attrs }">
														<v-text-field
															autocomplete="off"
															:disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta"
															v-model="paciente.fecha_nacimiento"
															:rules="[v => !!v || 'Campo obligatorio!']"
															hint="Fecha en Formato AAAA-MM-DD"
															label="Fecha de nacimiento"
															persistent-hint
															outlined
															v-bind="attrs"
															v-on="on"
														></v-text-field>
													</template>
													<v-date-picker v-model="paciente.fecha_nacimiento" no-title @input="menu = false" scrollable>

													</v-date-picker>
												</v-menu>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" :rules="[v => !!v || 'Campo obligatorio!']" v-model="paciente.edad" label="Edad" hide-details outlined></v-text-field>
											</v-col>

											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.numero_contacto" type="number" label="Número de contacto telefónico" hide-details outlined></v-text-field>
											</v-col>

											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.toma_temperatura" type="number" label="Toma de temperatura" hide-details outlined></v-text-field>
											</v-col>

											<v-col cols="12">
												<span class="headline">Datos de Dirección</span>
												<v-divider></v-divider>
											</v-col>
											<!-- <v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.calle" label="Calle" hide-details outlined></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.avenida" label="Avenida" hide-details outlined></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.nomenclatura" label="Nomenclatura" hide-details outlined></v-text-field>
											</v-col> -->
											<v-col cols="12" sm="6" md="6">
												<v-text-field :rules="[v => !!v || 'Campo obligatorio!']" :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.direccion" label="Dirección" hide-details outlined></v-text-field>
											</v-col>
											<!-- <v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.colonia" label="Colonia" hide-details outlined></v-text-field>
											</v-col> -->
											<v-col cols="12" sm="6" md="6">
												<v-select
													:disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta"
													:rules="[v => !!v || 'Campo obligatorio!']"
													v-model="paciente.zona"
													:items="zonas"
													outlined
													hide-details
													label="Zona"
												></v-select>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-select
													:disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta"
													:rules="[v => !!v || 'Campo obligatorio!']"
													v-model="paciente.id_colonia"
													:items="colonias"
													outlined
													hide-details
													label="Colonia"
													item-text="nombre"
													item-value="id"
												></v-select>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.otra_colonia" label="Otra Colonia" hide-details outlined></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.barrio" label="Barrio u Otro" hide-details outlined></v-text-field>
											</v-col>
											<v-col cols="12" sm="6" md="6">
												<v-textarea rows="3" :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.observaciones_direccion" label="Observaciones" hide-details outlined></v-textarea>
											</v-col>

											<!-- Nexo Epidemiologico -->

											<v-col cols="12">
												<span class="headline">Datos de Nexo Epidemiológico</span>
												<v-divider></v-divider>
											</v-col>
											<v-col cols="12" sm="6" md="12">
												<v-checkbox true-value="S" :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" v-model="paciente.contacto_paciente_positivo" hide-details class="mx-2 mt-0" label="Tuvo contacto con un paciente COVID positivo"></v-checkbox>
											</v-col>

											<v-col v-if="paciente.contacto_paciente_positivo" cols="12" sm="6" md="12">
												<v-card>
													<v-card-text>
														<v-row>
															<v-col cols="12" sm="6" md="6">
																<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.cuanto_tiempo_contacto" label="Hace cúanto tiempo tuvo el contacto" hide-details outlined></v-text-field>
															</v-col>
															<v-col cols="12" sm="6" md="6">
																<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta"  autocomplete="off" v-model="paciente.por_cuanto_tiempo_contacto" label="Por cuánto tiempo ha mantenido el contacto" hide-details outlined></v-text-field>
															</v-col>
															<v-col cols="12" sm="6" md="6">
																<v-checkbox true-value="S" :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" v-model="paciente.vive_mismo_lugar" hide-details class="mx-2 mt-0" label="Vive en el mismo lugar que el paciente positivo"></v-checkbox>

															</v-col>
														</v-row>
													</v-card-text>
												</v-card>
											</v-col>

											<v-col cols="12" sm="6" md="12">
												<v-checkbox true-value="S" :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" v-model="paciente.atencion_sin_equipo" hide-details class="mx-2 mt-0" label="Ha brindado atención sin equipo de protección adecuado a un caso confirmado en o fuera de un entorno médico"></v-checkbox>
											</v-col>

											<!-- Referencia Inicial Paciente -->
											<v-row class="mt-2" v-for="categoria in categorias" :key="categoria.id">
												<v-col cols="12">
													<span class="headline">{{ categoria.nombre }}</span>
													<v-divider></v-divider>
													<small>{{ categoria.descripcion }}</small>
												</v-col>

												<v-col v-if="categoria.id == 2" cols="12">
													<v-row>

														<v-col cols="12" sm="6" md="6">
															<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.frecuencia_cardiaca" label="Frecuencia Cardíaca" hide-details outlined></v-text-field>
														</v-col>

														<v-col cols="12" sm="6" md="6">
															<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.frecuencia_respiratoria" label="Frecuencia Respiratoria" hide-details outlined></v-text-field>
														</v-col>

														<v-col cols="12" sm="6" md="6">
															<v-text-field :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" autocomplete="off" v-model="paciente.saturacion_oxigeno" label="Saturación de Oxígeno" hide-details outlined></v-text-field>
														</v-col>
													</v-row>
												</v-col>

												<v-col v-for="verificacion in categoria.verificaciones" :key="verificacion.id" cols="12" sm="6" md="6">
													<v-row align="center" dense no-gutters>
														<v-col cols="10">
															<v-checkbox :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" v-model="verificacion.checked" hide-details class="mx-2 pt-0 mt-0" :label="verificacion.nombre"></v-checkbox>
														</v-col>
														<v-col>
															<v-btn @click="verificacion.mostrar_observacion = !verificacion.mostrar_observacion" v-if="verificacion.observacion" x-small icon tile>
																<v-icon :color="verificacion.comentario ? 'green' : ''">
																	{{ verificacion.icono }}
																</v-icon>
															</v-btn>
														</v-col>
														<v-col v-if="verificacion.mostrar_observacion" class="mt-4" cols="12">
															<v-textarea :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" v-model="verificacion.comentario" :label="verificacion.etiqueta_observacion" hide-details outlined rows="3">

															</v-textarea>
														</v-col>
													</v-row>

												</v-col>

											</v-row>

											<v-col cols="12">
												<span class="headline">Observaciones generales</span>
												<v-divider></v-divider>
											</v-col>
											<v-col cols="12" sm="6" md="12">
												<v-textarea :disabled="!usuario.editar_paciente || !usuario.editar_paciente_consulta" outlined label="Observaciones" rows="3" hint="Máximo 4,000 caracteres" counter="4000" v-model="paciente.observaciones"></v-textarea>
											</v-col>

										</v-row>
									</v-form>

								</v-tab-item>
								<v-tab-item :key="1">
									<v-row align="center">
										<v-col cols="12" sm="6" md="5">
											<v-text-field autocomplete="off" disabled v-model="paciente.correlativo" label="Caso No. " hide-details outlined required></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="7">
											<v-text-field autocomplete="off" disabled v-model="paciente.nombre_completo" label="Nombre" hide-details outlined required></v-text-field>
										</v-col>

									</v-row>

									<v-row>
										<v-col>
											<v-row>
												<v-col v-for="(item, index) in clasificacion" :key="index" cols="6" md="6">
													<v-card :flat="!item.checked" :elevation="item.checked ? 10 : null" @click="usuario.editar_clasificacion ? cambiar_clasificacion(item) : null" :color="item.color" min-height="100">
														<v-card-text>
															<v-row justify="center" align="center" dense no-gutters>
																<v-col>
																	<h1>{{ item.nombre }}</h1>
																</v-col>
																<v-col v-if="item.checked" align="end">
																	<v-icon x-large>
																		mdi-check
																	</v-icon>
																</v-col>
															</v-row>
														</v-card-text>
														<v-card-text class="pt-0 mt-0">
															{{ item.descripcion }}
														</v-card-text>
													</v-card>
												</v-col>

											</v-row>
										</v-col>
										<v-col cols="12" lg="7" md="7">
											<v-card min-height="280"  class="mt-4">
												<v-toolbar>
													<h2>Reportes</h2>
													<!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
													<v-card-text v-if="usuario">
														<v-btn
															absolute
															dark
															fab
															center
															right
															color="pink"
															small
															@click="agregar_bitacora = true"
															v-if="usuario.agregar_bitacora"
														>
														<v-icon>mdi-plus</v-icon>
														</v-btn>

													</v-card-text>
												</v-toolbar>


												<v-card-text v-if="agregar_bitacora">
													<h2 class="text-center">Agregar Reporte</h2>
													<v-form ref="form_reporte" v-model="valid_form_reporte">
														<v-row>
															<v-col cols="12" sm="6" md="6">
																<h3>Requiere medicamento</h3>
																<v-radio-group :rules="[v => !!v || 'Campo obligatorio!']" v-model="reporte.requiere_medicamento" row>
																	<v-radio label="Si" value="S"></v-radio>
																	<v-radio label="No" value="N"></v-radio>
																</v-radio-group>
															</v-col>
															<v-col>
																<v-textarea :rules="[v => !!v || 'Campo obligatorio!']" v-if="reporte.requiere_medicamento == 'N'" v-model="reporte.razon_no_medicamento" rows="3" autocomplete="off" label="Razón por la que no hay prescripción médica" hide-details outlined required></v-textarea>
															</v-col>
															<v-col cols="12" sm="6" md="6">
																<v-textarea v-model="reporte.observacion" rows="3" autocomplete="off" label="Observación" hide-details outlined required></v-textarea>
															</v-col>
															<v-col cols="12" sm="6" md="6">
																<v-textarea v-model="reporte.medicamento" rows="3" autocomplete="off" label="Indicaciones" hide-details outlined required></v-textarea>
															</v-col>

															<v-col cols="12" sm="6" md="6">

																<v-checkbox v-model="reporte.kit_medicamento" hide-details class="mx-2 pt-0 mt-0" label="Requiere entrega de kit de medicamento"></v-checkbox>

															</v-col>

															<v-col cols="12" sm="6" md="6">

																<v-checkbox :disabled="true" v-model="reporte.requiere_azitromicina" hide-details class="mx-2 pt-0 mt-0" label="Requiere Azitromicina"></v-checkbox>

															</v-col>

															<v-col cols="12" sm="12" md="12">

																<v-textarea v-model="reporte.otro_diagnostico" rows="3" autocomplete="off" label="Otro Diagnóstico" hide-details outlined required></v-textarea>

															</v-col>

															<v-col align="center">
																<v-btn @click="() => {
																	agregar_bitacora = false
																}">
																	<v-icon>
																		mdi-close-circle
																	</v-icon>
																</v-btn>

																<v-btn :disabled="reporte.reporte == ''" @click="registrar_reporte()" color="success" class="ml-2">
																	<v-icon>
																		mdi-content-save
																	</v-icon>
																</v-btn>
															</v-col>
														</v-row>
													</v-form>

													<v-divider class="mt-4"></v-divider>

												</v-card-text>

												<!-- Reportes ingresados -->
												<v-card-text class="mt-2" v-if="bitacora.length > 0">
													<v-expansion-panels focusable>
														<v-expansion-panel v-for="reporte in bitacora" :key="reporte.id">
															<v-expansion-panel-header>
																<h4>{{ reporte.created_at }}</h4>
																<br>

															</v-expansion-panel-header>
															<v-expansion-panel-content>
																<v-row>
																	<v-col cols="12">
																		<small>Registrado por: {{ reporte.medico }}</small>
																	</v-col>
																	<v-col cols="12" sm="6" md="6">
																		<h3>Requiere medicamento</h3>
																		<v-radio-group :disabled="!reporte.edit" v-model="reporte.requiere_medicamento" row>
																			<v-radio label="Si" value="S"></v-radio>
																			<v-radio label="No" value="N"></v-radio>
																		</v-radio-group>
																	</v-col>
																	<v-col>
																		<v-textarea :readonly="!reporte.edit" v-if="reporte.requiere_medicamento == 'N'" v-model="reporte.razon_no_medicamento" rows="3" autocomplete="off" label="Razón por la que no hay prescripción médica" hide-details outlined required></v-textarea>
																	</v-col>
																	<v-col cols="12" sm="6" md="6">
																		<v-textarea :readonly="!reporte.edit" v-model="reporte.medicamento" rows="3" autocomplete="off"  label="Medicamento" hide-details outlined required></v-textarea>
																	</v-col>
																	<v-col cols="12" sm="6" md="6">
																		<v-textarea :readonly="!reporte.edit" v-model="reporte.observacion" rows="3" autocomplete="off" label="Observación" hide-details outlined required></v-textarea>
																	</v-col>
																	<v-col cols="12" sm="6" md="6">

																		<v-checkbox :disabled="!reporte.edit" v-model="reporte.kit_medicamento" hide-details class="mx-2 pt-0 mt-0" label="Requiere entrega de kit de medicamento"></v-checkbox>

																	</v-col>

																	<v-col cols="12" sm="6" md="6">

																		<v-checkbox :disabled="true" v-model="reporte.requiere_azitromicina" hide-details class="mx-2 pt-0 mt-0" label="Requiere Azitromicina"></v-checkbox>

																	</v-col>

																	<v-col cols="12" sm="12" md="12">

																		<v-textarea :readonly="!reporte.edit" v-model="reporte.otro_diagnostico" rows="3" autocomplete="off" label="Otro Diagnóstico" hide-details outlined required></v-textarea>

																	</v-col>

																	<v-col v-if="reporte.editar_reporte" align="center">
																		<v-btn @click="eliminar_reporte(reporte)" color="error">
																			<v-icon>
																				mdi-delete
																			</v-icon>
																		</v-btn>

																		<v-btn @click="() => {

																			reporte.edit ? editar_reporte(reporte) : reporte.edit = true

																		}" :color="reporte.edit ? 'success' : 'primary'" class="ml-2">
																			<v-icon>
																				{{ reporte.edit ? 'mdi-content-save' : 'mdi-pencil' }}
																			</v-icon>
																		</v-btn>
																	</v-col>
																</v-row>
															</v-expansion-panel-content>
														</v-expansion-panel>
													</v-expansion-panels>
												</v-card-text>

												<!-- Sin reportes -->

												<v-card-text v-if="bitacora.length <= 0">
													<h2 class="text-center">Aún se se han registrado reportes</h2>
												</v-card-text>
											</v-card>
										</v-col>
									</v-row>

								</v-tab-item>
							</v-tabs-items>
						</v-container>

					</v-card-text>
				</v-card>

			</v-dialog>

			<v-dialog v-model="mensaje_registro" max-width="400">
				<v-card>
					<v-card-title class="headline">
						{{ titulo_mensaje }}
					</v-card-title>

					<v-card-text>
						<div v-html="cuerpo_mensaje">

						</div>
						{{ cuerpo_mensaje }}
					</v-card-text>

					<v-divider></v-divider>

					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn @click="mensaje_registro = false" color="primary" text>
							ACEPTAR
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-row>
    </div>
</template>

<script>

	import Swal from 'sweetalert2'

    export default {
		props: {
			show_dialog: {
				type: Boolean,
				default: false
			},
			obtener_detalle: {
				type: Boolean,
				default: false
			},
			id_paciente: null,
			usuario: null
		},
        data: () => ({
			text: 'center',
			valid_form_reporte: true,
			dialog: false,
			menu: false,
			date: null,
			tab: 0,
			sintomas: [],
			valid_form: true,
			paciente:{
				nombre: "",
				segundo_nombre: "",
				apellido: "",
				segundo_apellido: "",
				dpi: "",
				genero: null,
				fecha_nacimiento: "",
				edad: "",
				numero_contacto: "",
				toma_temperatura: "",
				afiliacion_igss: "",
				calle: "",
				avenida: "",
				nomenclatura: "",
				colonia: "",
				zona: "",
				barrio: "",
				observaciones_direccion: "",
				contacto_paciente_positivo: "",
				cuanto_tiempo_contacto: "",
				por_cuanto_tiempo_contacto: "",
				vive_mismo_lugar: "",
				atencion_sin_equipo: "",
				observaciones: ""
			},
			zonas: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,15,17,18,19,21,24,25],
			bitacora: [],
			mensaje_registro: false,
			titulo_mensaje: null,
			cuerpo_mensaje: null,
			agregar_bitacora: false,
			reporte: {
				medicamento: "",
				observacion: ""
			},
			categorias: [],
			clasificacion: [],
			colonias: []
		}),
		methods:{

			closeDialog(){

				this.$refs.form_paciente.reset()
				this.mensaje_registro = false
				this.sintomas = []
				this.paciente = {
					nombre: "",
					segundo_nombre: "",
					apellido: "",
					segundo_apellido: "",
					dpi: "",
					genero: null,
					fecha_nacimiento: "",
					edad: "",
					numero_contacto: "",
					toma_temperatura: "",
					afiliacion_igss: "",
					calle: "",
					avenida: "",
					nomenclatura: "",
					colonia: "",
					zona: "",
					barrio: "",
					observaciones_direccion: "",
					contacto_paciente_positivo: "",
					cuanto_tiempo_contacto: "",
					por_cuanto_tiempo_contacto: "",
					vive_mismo_lugar: "",
					atencion_sin_equipo: "",
					observaciones: ""
				}
				this.$emit('closeDialog')

			},
			obtener_sintomas(){

				this.axios.get(process.env.VUE_APP_API_URL + 'obtener_sintomas.php')
                .then((response) => {

					this.categorias = response.data

                })

			},
			obtener_clasificacion(){

				this.axios.get(process.env.VUE_APP_API_URL + 'obtener_clasificacion.php')
                .then((response) => {

					this.clasificacion = response.data

				})

			},
			registrar_paciente(){

				this.$refs.form_paciente.validate()

				if (this.valid_form) {

					let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

					this.paciente.id_campamento = usuario.id_campamento
					this.paciente.registrado_por = usuario.id

					this.paciente.categorias = this.categorias

					this.axios.post(process.env.VUE_APP_API_URL + 'registrar_paciente.php', this.paciente)
					.then((response) => {

						Swal.fire({
							title: response.data.title,
							html: response.data.message,
							icon: 'success'
						}).then(() => {
							this.closeDialog()
							this.$emit('actualizarTabla')
						})

					})

				}

			},
			editar_paciente(){

				this.$refs.form_paciente.validate()

				if (this.valid_form) {

					this.paciente.categorias = this.categorias

					this.axios.post(process.env.VUE_APP_API_URL + 'editar_paciente.php', this.paciente)
					.then((response) => {

						Swal.fire({
							title: response.data.title,
							html: response.data.message,
							icon: 'success'
						}).then(() => {
							this.closeDialog()
							this.$emit('actualizarTabla')
						})
					})

				}

			},
			detalle_paciente(){

				let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

				let data = {
					id: this.id_paciente,
					id_usuario: usuario.id
				}

				this.axios.post(process.env.VUE_APP_API_URL + 'detalle_paciente.php', data)
				.then((response) => {

					this.paciente = response.data
					this.categorias = response.data.categorias
					this.bitacora = response.data.bitacora
					this.clasificacion = response.data.clasificacion

					this.obtener_colonias(this.paciente.zona)

				})

			},
			registrar_reporte(){

				this.$refs.form_reporte.validate()

				if (this.valid_form_reporte) {

					let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

					this.reporte.id_paciente = this.paciente.id
					this.reporte.id_medico = usuario.id

					this.axios.post(process.env.VUE_APP_API_URL + 'registrar_reporte.php', this.reporte)
					// eslint-disable-next-line no-unused-vars
					.then((response) => {

						this.reporte = {
							medicamento: "",
							observacion: ""
						}

						this.agregar_bitacora = false

						this.detalle_paciente()

					})

				}

			},
			eliminar_reporte(reporte){

				Swal.fire({
					title: '¿Está seguro?',
					text: "Una vez eliminado no se podrá recuperar!",
					icon: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Si, ELIMINAR',
					cancelButtonText: 'Cancelar'
				}).then((result) => {

					if (result.value) {

						let data = {
							id_reporte: reporte.id
						}

						this.axios.post(process.env.VUE_APP_API_URL + 'eliminar_reporte.php', data)
						// eslint-disable-next-line no-unused-vars
						.then((response) => {

							if (response.data) {

								Swal.fire(
									'Excelente!',
									'El reporte ha sido eliminado exitosamente.',
									'success'
								).then(() => {

									this.detalle_paciente()

								})

							}

						})

					}
				})

			},
			editar_reporte(reporte){

				this.axios.post(process.env.VUE_APP_API_URL + 'editar_reporte.php', reporte)
				// eslint-disable-next-line no-unused-vars
				.then((response) => {

					if (response.data) {

						Swal.fire(
							'Excelente!',
							'El reporte ha sido actualizado exitosamente.',
							'success'
						).then(() => {

							reporte.edit = false
							this.detalle_paciente()

						})

					}

				})

			},
			cambiar_clasificacion(item){

				let data = {
					id_clasificacion: item.id,
					id_paciente: this.id_paciente
				}

				this.axios.post(process.env.VUE_APP_API_URL + 'cambiar_clasificacion.php', data)
				// eslint-disable-next-line no-unused-vars
				.then((response) => {
					console.log(response.data)
					this.detalle_paciente()
				})

			},
			obtener_colonias(zona){

				let data = {

					zona: zona,

				}

				this.axios.post(process.env.VUE_APP_API_URL + 'obtener_colonias.php', data)
				// eslint-disable-next-line no-unused-vars
				.then((response) => {
					console.log(response.data)
					this.colonias = response.data
				})

			}

		},
		mounted(){

			//this.obtener_clasificacion()
			this.obtener_sintomas()

		},
		watch: {

			show_dialog(val){

				if (val) {

					if (this.obtener_detalle) {
						this.detalle_paciente()
					}else{
						this.obtener_sintomas()
					}

				}

			}
		}
    }
</script>