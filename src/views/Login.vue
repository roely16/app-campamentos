<template>
    <v-main>
        <v-container style="background-image: url('./img/fondoLogin.png'); height: 100vh; background-size:cover" fluid >
            <v-row style="height: 25vh" dense align="center" justify="center">
                <v-col cols="4" md="2" lg="1">
                    <v-img src="@/assets/logo_muni_circulo.png" contain></v-img>
                </v-col>
            </v-row>
            <v-row style="height: 50vh" dense align="center" justify="center">
                <v-col cols="12" lg="4" md="12">
                    <Form></Form>
                </v-col>
            </v-row>

            <v-row style="height: 15vh" dense align="end" justify="center">
                <v-col cols="8" md="4" lg="3">
                    <v-img src="@/assets/juntoslogramosmas.png" contain></v-img>
                </v-col>

                <v-col class="text-center" cols="12">
                    <h4 class="white--text">¿Aún no tiene cuenta? <v-btn :to="{name: 'registro' }" dark large text color="yellow">Registrarse</v-btn></h4>
                </v-col>
            </v-row>
        </v-container>
    </v-main>
</template>

<script>

    import Form from '@/components/Login/Form.vue'

    export default {
        components: {
            Form
        },
    }
</script>