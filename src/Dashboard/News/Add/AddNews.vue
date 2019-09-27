<template>
  <transition name="fade-normal">
    <div class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-card">
        <Alert :sentProperly="sentProperly" :alertMessage="alertMessage"></Alert>
        <header class="modal-card-head">
          <p class="modal-card-title">Dodaj wydarzenie</p>
          <button class="delete" aria-label="close" @click="closeModal"></button>
        </header>
        <section class="modal-card-body">
          <form class="form">
            <div class="field">
              <label class="label" for="name">Nazwa wydarzenia</label>
              <div class="control">
                <input v-model="news.name" name="nazwa" v-validate="'required'" data-vv-delay="250" class="input" id="name" type="text" placeholder="Mistrzostwa Piłki Nożnej 2018">
              </div>
              <transition name="fade-left">
                <div class="help is-danger" v-if="errors.has('nazwa')">{{errors.first('nazwa')}}</div>
              </transition>
            </div>
            <div class="field">
              <label class="label" for="name">Data wydarzenia</label>
              <div class="control">
                <input v-model="news.date" name="data" v-validate="'required'" data-vv-delay="250" class="input" id="name" type="date">
              </div>
              <transition name="fade-left">
                <div class="help is-danger" v-if="errors.has('data')">{{errors.first('data')}}</div>
              </transition>
            </div>
            <div class="field">
              <label class="label" for="description">Opis wydarzenia</label>
              <div class="control">
                <textarea class="textarea"  name="opis" v-validate="'required'" data-vv-delay="250" v-model="news.description" id="description" placeholder="Treść opisu wydarzenia" rows="5"></textarea>
              </div>
              <transition name="fade-left">
                <div class="help is-danger" v-if="errors.has('opis')">{{errors.first('opis')}}</div>
              </transition>
            </div>
            <div class="field">
              <div class="file has-name">
                <label class="file-label">
                  <input class="file-input" type="file" name="file" @change="onFileSelected" accept="image/*">
                  <span class="file-cta">
                    <span class="file-icon">
                      <i class="fa fa-cloud-upload-alt"></i>
                    </span>
                    <span class="file-label">Dodaj zdjęcie</span>
                  </span>
                </label>
              </div>
            </div>
            <div v-if="displayImage">
              <img class="attachment-image" :src="displayImage"/>
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
  name: "AddNews",
  data() {
    return {
      news: {
        name: "",
        description: "",
        date: null,
      },
      image: '',
      displayImage: '',
      alertMessage: null,
      sentProperly: false,
      alertTimeoutId: null
    }
  },
  methods: {
    async handleSubmit() {
      clearTimeout(this.alertTimeoutId);
      const valid = await this.$validator.validateAll();

      if (valid) {

        this.$store.dispatch('addNews', {
          news: this.news,
          image: this.image
        });

        this.sentProperly = true;
        this.alertMessage = "Pomyślnie dodano nowe wydarzenie";

        this.$validator.reset();
      }
      else {
        this.sentProperly = false;
        this.alertMessage = "Wypełnij pola";
      }

      this.alertTimeoutId = setTimeout(() => {
        this.alertMessage = undefined;
      }, 3000);
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
    }
  }
}

</script>