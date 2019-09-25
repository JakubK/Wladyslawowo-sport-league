<template>
  <transition name="fade-normal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <Alert :sentProperly="sentProperly" :alertMessage="alertMessage"></Alert>
        <header class="modal-card-head">
          <p class="modal-card-title">Edycja zawodnika</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <form class="form">
            <div class="field">
              <label class="label" for="name">Nazwisko lub imię</label>
              <div class="control">
                <input v-validate="'required'" data-vv-delay="250" name="name" class="input" id="name" type="text" placeholder="Jan Kowalski" v-model="player.name">
              </div>
              <transition name="fade-left">
                  <p class="help is-danger" v-if="errors.has('name')">{{errors.first('name')}}</p>
              </transition>
            </div>
            <div class="field">
              <label class="label" for="settlement">Dzielnica lub wieś</label>
              <div class="control">
                <div class="select">
                  <select id="settlement" v-model="player.settlementId" @change="switchSettlementId($event)" v-validate="'required'" data-vv-delay="250" name="settlement">
                    <option :value="settlement.id" v-for="settlement in settlements" :key="settlement.id">{{settlement.name}}</option>
                  </select>
                </div>
                <transition name="fade-left">
                  <div class="help is-danger" v-if="errors.has('settlement')">{{errors.first('settlement')}}</div>
                </transition>
              </div>
            </div>
            <div class="field">
              <div class="file has-name">
                <label class="file-label">
                  <input class="file-input" type="file" @change="onFileSelected" accept="image/*">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fa fa-cloud-upload-alt"></i>
                    </span>
                    <span class="file-label">Zmień zdjęcie</span>
                  </span>
                  <br>
                </label>
              </div>
            </div>
            <div v-if="displayImage">
              <img class="attachment-image" :src="displayImage"/>
            </div>
            <div v-else-if="player.media">
              <img class="attachment-image" :src="player.media"/>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-danger" @click="handleSubmit">Zapisz</button>
          <button class="button" @click="closeModal">Anuluj</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "UpdatePlayer",
  props: ['id'],
  data() {
    return {
      image: '',
      displayImage: '',
      settlement: "",
      alertMessage: null,
      sentProperly: false,
      alertTimeoutId: null
    }
  },
  methods: {
    async handleSubmit() {
      const valid = await this.$validator.validateAll();

      if (valid) {
        this.$store.dispatch('updatePlayer',this.player, this.image);
        this.closeModal();
      }
    },
    switchSettlementId(e)
    {
      this.player.settlementId = e.target.value;
    },
    onFileSelected(event) {
      this.image = event.target.files[0];
      let files = event.target.files || event.dataTransfer.files;

      if (!files.length) {
        return;
      }

      this.createImage(files[0]);
    },
    createImage(file) {
      let image = new Image();
      let reader = new FileReader();
      let vm = this;

      reader.onload = (e) => {
        vm.displayImage = e.target.result;
      };

      reader.readAsDataURL(file);
    },
    closeModal() {
      this.$store.dispatch('closeModal');
    },
  },
  computed: {
    settlements() {
      return this.$store.getters.dashboardSettlements;
    },
    player(){
      return this.$store.getters.dashboardPlayer;
    }
  },
  created() {
    this.$store.dispatch("dashboardPlayer", this.id);
    this.$store.dispatch("dashboardSettlements");
  }
}

</script>