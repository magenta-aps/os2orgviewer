<template>
  <dl class="oc-address-list" v-if="addresses && addresses.length > 0">
    <template v-for="address in addresses">
      <div
        :key="address.uuid"
        v-if="!address.visibility || address.visibility.name !== 'Hemmelig'"
      >
        <!--
                    WARNING: Customer specific hack
                    `Dokumentadresser` will be inserted as link with text: "Vis enhedens dokumenter"
                -->
        <template
          v-if="
            address.address_type.name === 'Dokumentaddresse' &&
            address.address_type.scope === 'WWW'
          "
        >
          <dt>Dokumenter</dt>
          <dd>
            <a :href="address.value" target="_blank">Vis enhedens dokumenter</a>
          </dd>
        </template>

        <template v-else-if="address.address_type.scope === 'DAR'">
          <dt>{{ address.address_type.name }}</dt>
          <dd><dawa-address :uuid="address.value" /></dd>
        </template>

        <template v-else-if="address.address_type.scope === 'EMAIL'">
          <dt>E-mail</dt>
          <dd>
            <a :href="`mailto:${address.value}`">{{ address.value }}</a>
          </dd>
        </template>

        <template v-else-if="address.address_type.scope === 'PHONE'">
          <dt>Telefon</dt>
          <dd>
            <a :href="`tel:${address.value}`">{{ address.value }}</a>
          </dd>
        </template>

        <template v-else-if="address.address_type.scope === 'WWW'">
          <dt>{{ address.address_type.name }}</dt>
          <dd>
            <a :href="address.value" target="_blank">{{ address.value }}</a>
          </dd>
        </template>

        <template v-else>
          <dt>{{ address.address_type.name }}</dt>
          <dd>{{ address.value }}</dd>
        </template>
      </div>
    </template>
  </dl>
  <p class="oc-address-list" v-else>Ingen detaljer fundet</p>
</template>

<script>
import DawaAddress from "./Address.vue"

export default {
  components: {
    DawaAddress,
  },
  props: ["addresses"],
}
</script>

<style lang="scss">
.oc-address-list {
  margin: 0;
  padding: 0;
}
</style>
