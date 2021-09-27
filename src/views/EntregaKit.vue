<template>
    <div>
        <v-container fluid>
            <v-row>
                <v-col col="12" sm="6" md="4">
                    <v-text-field hide-details v-model="busqueda" outlined label="Buscar" append-icon="mdi-magnify" type="text" autocomplete="off" dense></v-text-field>
                </v-col>
            </v-row>

            <v-row align="center">
                <v-col>
                    <v-btn :color="paciente_sin_kit ? 'primary' : null" @click="filtrar_pacientes()">Pacientes Sin Kit</v-btn>
                    <v-btn @click="obtener_pacientes()" class="ml-4">Actualizar</v-btn>
                </v-col>
                <v-col align="end">
                    <h1 class="pb-0 mb-0" style="font-size: 3em">{{ items.length }}</h1>
                    <small class="font-weight-light mt-0 pt-0">
                        {{ paciente_sin_kit ? 'Pacientes sin Kit' : 'Kits recomendados' }}
                    </small>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-data-table
                        :headers="headers"
                        :items="items"
                        :items-per-page="20"
                        class="elevation-1"
                        hide-default-footer
                        :page.sync="page"
                        :loading="loading"
                        :search="busqueda"
                        @page-count="pageCount = $event"
                    >
                        <template v-slot:[`item.nombre`]="{ item }">
                            {{ item.nombre.toUpperCase() }} {{ item.segundo_nombre.toUpperCase() }} {{ item.apellido.toUpperCase() }} {{ item.segundo_apellido.toUpperCase() }}
                        </template>

                        <template v-slot:[`item.colonia`]="{ item }">

                            <div v-if="item.colonia != 'SIN COLONIA'">
                                {{ item.colonia }}
                            </div>

                            <div v-if="item.colonia == 'SIN COLONIA'">
                                <div v-if="item.otra_colonia">
                                    {{ item.otra_colonia }}
                                </div>
                                <div v-if="!item.otra_colonia">
                                    SIN COLONIA
                                </div>
                            </div>

                        </template>

                        <template v-slot:[`item.requiere_azitromicina`]="{ item }">
                            <v-chip small v-if="item.requiere_azitromicina" color="red darken-1" dark>SI</v-chip>
                            <v-chip small v-if="!item.requiere_azitromicina" color="blue darken-1" dark>NO</v-chip>
                        </template>

                        <template v-slot:[`item.accion`]="{ item }">

                            <div v-if="!paciente_sin_kit">
                                <v-btn @click="atender(item)" tile icon small dark color="green darken-1">
                                    <v-icon dark>
                                        mdi-package-variant
                                    </v-icon>
                                </v-btn>

                                <v-btn class="ml-3" tile icon  @click="detalle(item)" small color="primary">
                                    <v-icon dark>mdi-pencil</v-icon>
                                </v-btn>

                                 <v-btn  @click="add_kit(false, item)" class="ml-3" tile icon small color="error">
                                    <v-icon dark>mdi-close-circle</v-icon>
                                </v-btn>
                            </div>

                            <div v-if="paciente_sin_kit">
                                <v-btn @click="add_kit(true, item)" class="ml-3" tile icon small color="info">
                                    <v-icon dark>mdi-account-plus</v-icon>
                                </v-btn>
                                <v-btn class="ml-3" tile icon  @click="detalle(item)" small color="primary">
                                    <v-icon dark>mdi-pencil</v-icon>
                                </v-btn>
                            </div>

                        </template>

                    </v-data-table>

                </v-col>
                <v-col cols="12">
                    <v-pagination
                        v-model="page"
                        :length="pageCount"
                        :total-visible="5"
                    ></v-pagination>
                </v-col>
            </v-row>

            <v-dialog v-model="dialog" max-width="400" @click:outside="() => { this.$refs.form_entrega.reset() }">
                <v-card>
                    <v-card-title class="headline">Entregar Kit</v-card-title>
                    <v-card-text>
                        <v-form ref="form_entrega" v-model="valid_form">
                            <v-row>
                                <v-col cols="12">
                                    <small>Paciente: </small>
                                    <h2>{{ paciente.nombre }} {{ paciente.segundo_nombre }} {{ paciente.apellido }} {{ paciente.segundo_apellido }}</h2>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea :rules="[v => !!v || 'Campo obligatorio!']" v-model="entrega_medicamento.recibe" hide-details outlined rows="2" label="Nombre de quien recibe"></v-textarea>
                                </v-col>

                                <v-col cols="12">
                                    <v-textarea v-model="entrega_medicamento.comentarios" hide-details outlined rows="3" label="Comentarios"></v-textarea>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="() => {

                                this.$refs.form_entrega.reset()
                                dialog = false

                            }"
                        >
                            Cancelar
                        </v-btn>

                        <v-btn
                            color="green darken-1"
                            text
                            @click="entregar()"
                        >
                            Aceptar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>

            <Form :usuario="usuario" :obtener_detalle="obtener_detalle" :id_paciente="id_paciente" :show_dialog="show_dialog" @closeDialog="() => {
            obtener_detalle = false
            id_paciente = null
            show_dialog = false}" />

        </v-container>
    </div>
</template>

<script>

    import Form from '@/components/Pacientes/FormConsulta.vue'
    import Swal from 'sweetalert2'

    export default {
        components: {
            Form
        },
        data(){
            return{
                busqueda: null,
                headers: [],
                items: [],
                campamentos: [],
                dialog: false,
                paciente: {},
                valid_form: true,
                entrega_medicamento: {
                    recibe: null,
                    comentarios: null
                },
                tab: null,
                campamento_select: null,
                page: 1,
                pageCount: null,
                usuario: null,
                show_dialog: false,
                obtener_detalle: false,
                id_paciente: null,
                loading: false,
                paciente_sin_kit: false
            }
        },
        methods: {

            obtener_pacientes(){

                this.loading = true

                //this.campamento_select = this.usuario.id_campamento

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                let data = {
                    id_campamento: usuario.id_campamento,
                    pacientes_sin_kit: this.paciente_sin_kit,
                    busqueda: this.busqueda,
                    page: this.page
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'obtener_farmacia_doctor.php', data)
                .then((response) => {

                    this.headers = response.data.headers
                    this.items = response.data.items
                    this.loading = false

                })

            },
            atender(paciente){

                this.dialog = true
                this.paciente = paciente

            },
            detalle(item){

                this.obtener_detalle = true
                this.id_paciente = item.id
                this.show_dialog = true

            },
            detalle_usuario(){

                let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                let data = {
                    id_usuario: usuario.id
                }

                this.axios.post(process.env.VUE_APP_API_URL + 'detalle_usuario.php', data)
                .then((response) => {

                    this.usuario = response.data
                    this.en_linea = response.data.en_linea

                    if (response.data.clinica) {

                        this.clinica_seleccionada = response.data.clinica.id

                    }else{

                        this.clinica_seleccionada = 0

                    }

                })

            },
            entregar(){

                this.$refs.form_entrega.validate()

                if (this.valid_form) {

                    let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))

                    this.entrega_medicamento.id_paciente = this.paciente.id
                    this.entrega_medicamento.id_persona_entrega_kit = usuario.id

                    this.axios.post(process.env.VUE_APP_API_URL + 'entregar_kit_doctor.php', this.entrega_medicamento)
                    .then((response) => {

                        if (response.data) {

                            Swal.fire(
                                'Excelente!',
                                'Se ha registrado la entrega del kit.',
                                'success'
                            ).then(() => {

                                this.$refs.form_entrega.reset()
                                this.obtener_pacientes(this.campamento_select)
                                this.dialog = false

                            })

                        }
                    })

                }

            },
            filtrar_pacientes(){

                this.paciente_sin_kit = !this.paciente_sin_kit

                this.obtener_pacientes()

            },
            add_kit(value, item){

                Swal.fire({
                    title: '¿Está seguro?',
                    text: value ? "Se agregará el kit al paciente!" : "Se removerá el kit del paciente",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: value ? '#3085d6' : '#e33d3d',
                    cancelButtonColor: '#cccccc',
                    cancelButtonText: 'Cancelar',
                    confirmButtonText: value ? 'SI, AGREGAR!' : 'SI, QUITAR!',
                    }).then((result) => {
                        if (result.isConfirmed) {

                            const data = {
                                add: value,
                                id: item.id
                            }

                            console.log(data)

                            this.axios.post(process.env.VUE_APP_API_URL + 'actualizar_kit.php', data)
                            .then((response) => {

                                if (response.data) {
                                    this.obtener_pacientes()
                                }

                            })

                        }
                })

            }
        },
        created(){

            let usuario = JSON.parse(localStorage.getItem('usuario-campamentos'))
            this.tab = usuario.id_campamento - 1
            this.campamento_select = usuario.id_campamento

            this.detalle_usuario()

            this.obtener_pacientes()

            this.$nextTick(function () {
                window.setInterval(() => {
                    // this.obtener_pacientes(this.campamento_select)
                },5000);
            })

        }
    }
</script>

<style>

</style>