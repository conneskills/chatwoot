<script>
import { mapGetters } from 'vuex';
import { useVuelidate } from '@vuelidate/core';
import { minValue } from '@vuelidate/validators';
import { useAlert } from 'dashboard/composables';
import { useConfig } from 'dashboard/composables/useConfig';
import SettingsFieldSection from 'dashboard/components-next/Settings/SettingsFieldSection.vue';
import NextButton from 'dashboard/components-next/button/Button.vue';

export default {
  components: {
    SettingsFieldSection,
    NextButton,
  },
  props: {
    inbox: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { isEnterprise } = useConfig();

    return { v$: useVuelidate(), isEnterprise };
  },
  data() {
    return {
      selectedAgents: [],
      isAgentListUpdating: false,
      enableAutoAssignment: false,
      maxAssignmentLimit: null,
    };
  },
  computed: {
    ...mapGetters({
      agentList: 'agents/getAgents',
    }),
    maxAssignmentLimitErrors() {
      if (this.v$.maxAssignmentLimit.$error) {
        return this.$t(
          'INBOX_MGMT.AUTO_ASSIGNMENT.MAX_ASSIGNMENT_LIMIT_RANGE_ERROR'
        );
      }
      return '';
    },
  },
  watch: {
    inbox() {
      this.setDefaults();
    },
  },
  mounted() {
    this.setDefaults();
  },
  methods: {
    setDefaults() {
      this.enableAutoAssignment = this.inbox.enable_auto_assignment;
      this.maxAssignmentLimit =
        this.inbox?.auto_assignment_config?.max_assignment_limit || null;
      this.fetchAttachedAgents();
    },
    async fetchAttachedAgents() {
      try {
        const response = await this.$store.dispatch('inboxMembers/get', {
          inboxId: this.inbox.id,
        });
        const {
          data: { payload: inboxMembers },
        } = response;
        this.selectedAgents = inboxMembers;
      } catch (error) {
        //  Handle error
      }
    },
    handleEnableAutoAssignment() {
      this.updateInbox();
    },
    async updateAgents() {
      const agentList = this.selectedAgents.map(el => el.id);
      this.isAgentListUpdating = true;
      try {
        await this.$store.dispatch('inboxMembers/create', {
          inboxId: this.inbox.id,
          agentList,
        });
        useAlert(this.$t('AGENT_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      } catch (error) {
        useAlert(this.$t('AGENT_MGMT.EDIT.API.ERROR_MESSAGE'));
      }
      this.isAgentListUpdating = false;
    },
    async updateInbox() {
      try {
        const payload = {
          id: this.inbox.id,
          formData: false,
          enable_auto_assignment: this.enableAutoAssignment,
          auto_assignment_config: {
            max_assignment_limit: this.maxAssignmentLimit,
          },
        };
        await this.$store.dispatch('inboxes/updateInbox', payload);
        useAlert(this.$t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      } catch (error) {
        useAlert(this.$t('INBOX_MGMT.EDIT.API.SUCCESS_MESSAGE'));
      }
    },
  },
  validations: {
    selectedAgents: {
      isEmpty() {
        return !!this.selectedAgents.length;
      },
    },
    maxAssignmentLimit: {
      minValue: minValue(1),
    },
  },
};
</script>

<template>
  <SettingsFieldSection
    :label="$t('INBOX_MGMT.SETTINGS_POPUP.INBOX_AGENTS')"
    :help-text="$t('INBOX_MGMT.SETTINGS_POPUP.INBOX_AGENTS_SUB_TEXT')"
    class="[&>div]:!items-start"
  >
    <multiselect
      v-model="selectedAgents"
      :options="agentList"
      track-by="id"
      label="name"
      multiple
      :close-on-select="false"
      :clear-on-select="false"
      hide-selected
      placeholder="Pick some"
      selected-label
      :select-label="$t('FORMS.MULTISELECT.ENTER_TO_SELECT')"
      :deselect-label="$t('FORMS.MULTISELECT.ENTER_TO_REMOVE')"
      class="!mb-0"
      @select="v$.selectedAgents.$touch"
    />

    <template #extra>
      <div class="grid grid-cols-1 lg:grid-cols-8">
        <div class="col-span-1 lg:col-span-2" />
        <div class="col-span-1 lg:col-span-6 mt-4 justify-self-end">
          <NextButton
            :label="$t('INBOX_MGMT.SETTINGS_POPUP.UPDATE')"
            :is-loading="isAgentListUpdating"
            @click="updateAgents"
          />
        </div>
      </div>
    </template>
  </SettingsFieldSection>

  <SettingsFieldSection
    :label="$t('INBOX_MGMT.SETTINGS_POPUP.AGENT_ASSIGNMENT')"
    class="[&>div]:!items-baseline"
  >
    <div class="flex items-center gap-2 mt-1 lg:mt-0">
      <input
        id="enableAutoAssignment"
        v-model="enableAutoAssignment"
        type="checkbox"
        @change="handleEnableAutoAssignment"
      />
      <label for="enableAutoAssignment" class="text-heading-3 text-n-slate-12">
        {{ $t('INBOX_MGMT.SETTINGS_POPUP.AUTO_ASSIGNMENT') }}
      </label>
    </div>

    <p class="text-body-main text-n-slate-11 mt-1">
      {{ $t('INBOX_MGMT.SETTINGS_POPUP.AUTO_ASSIGNMENT_SUB_TEXT') }}
    </p>

    <div v-if="enableAutoAssignment && isEnterprise" class="py-3">
      <woot-input
        v-model="maxAssignmentLimit"
        type="number"
        :class="{ error: v$.maxAssignmentLimit.$error }"
        :error="maxAssignmentLimitErrors"
        :label="$t('INBOX_MGMT.AUTO_ASSIGNMENT.MAX_ASSIGNMENT_LIMIT')"
        class="[&>input]:!mb-0"
        @blur="v$.maxAssignmentLimit.$touch"
      />

      <p class="mt-1.5 text-label-small text-n-slate-11">
        {{ $t('INBOX_MGMT.AUTO_ASSIGNMENT.MAX_ASSIGNMENT_LIMIT_SUB_TEXT') }}
      </p>
    </div>
    <template v-if="enableAutoAssignment && isEnterprise" #extra>
      <div class="grid grid-cols-1 lg:grid-cols-8">
        <div class="col-span-1 lg:col-span-2" />
        <div class="col-span-1 lg:col-span-6 mt-4 justify-self-end">
          <NextButton
            :label="$t('INBOX_MGMT.SETTINGS_POPUP.UPDATE')"
            :disabled="v$.maxAssignmentLimit.$invalid"
            @click="updateInbox"
          />
        </div>
      </div>
    </template>
  </SettingsFieldSection>
</template>
