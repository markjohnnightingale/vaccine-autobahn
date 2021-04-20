<template>
  <footer class="footer">
    <div class="container">
      <div class="columns">
        <div class="column is-4">
          <div class="footer__zone content is-small">
            <p class="title is-size-5">
              {{ $t("site.title") }}
            </p>
            <p
              v-html="
                $t('footer.byline', {
                  link: 'https://www.marknightingale.net',
                  github:
                    'https://github.com/markjohnnightingale/vaccine-autobahn',
                  licence: 'https://choosealicense.com/licenses/gpl-3.0/#'
                })
              "
            ></p>
          </div>
        </div>
        <div class="column is-4">
          <div class="footer__zone content is-small">
            <p class="title is-size-6">
              {{ $t("footer.data-source") }}
            </p>
            <p
              v-html="
                $t('footer.data-source-text', {
                  link: 'https://impfdashboard.de/daten'
                })
              "
            ></p>
          </div>
        </div>
        <div class="column is-4">
          <div class="footer__zone content is-small block">
            <p class="title is-size-6">
              {{ $t("footer.assumptions-title") }}
            </p>
            <p class="">
              {{ $t("footer.assumptions-population") }}
              {{ numeral($config.vaccinatablePopulation).format("0a") }}
              <a
                href="https://www.statista.com/statistics/454349/population-by-age-group-germany/"
                >{{ $t("footer.source") }}</a
              >
            </p>
            <p class="">
              {{ $t("footer.assumptions-vaccine-readiness") }}
              {{ numeral($config.vaccineReadiness).format("0 %") }}
              <a
                href="https://www.focus.de/gesundheit/coronavirus/impfbereitschaft-in-deutschland-immer-mehr-menschen-wollen-sich-impfen-lassen-doch-herdenimmunitaet-liegt-in-weiter-ferne_id_13048003.html"
              >
                {{ $t("footer.source") }}
              </a>
            </p>
            <p class="">
              {{ $t("footer.assumptions-vaccination-speed") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import numeral from "numeral";
export default {
  methods: {
    numeral(value) {
      return numeral(value);
    }
  }
};
</script>

<style lang="scss">
.footer {
  margin-top: 3rem;
}
</style>
