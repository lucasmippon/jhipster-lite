import { defineComponent, inject } from 'vue';
import { AngularService } from '@/springboot/domain/client/AngularService';
import { ProjectToUpdate, toProject } from '@/springboot/primary/ProjectToUpdate';
import { Logger } from '@/common/domain/Logger';
import { GeneratorButtonVue } from '@/springboot/primary/generator/generator-button';
import ToastService from '@/common/secondary/ToastService';

export default defineComponent({
  name: 'AngularGeneratorComponent',

  components: {
    GeneratorButtonVue,
  },

  props: {
    project: {
      type: Object,
      required: true,
    },
  },

  setup(props) {
    const logger = inject('logger') as Logger;
    const angularService = inject('angularService') as AngularService;
    const toastService = inject('toastService') as ToastService;

    const selectorPrefix = 'angular-generator';

    const addAngular = async (): Promise<void> => {
      if (props.project.folder !== '') {
        await angularService
          .add(toProject(props.project as ProjectToUpdate))
          .then(() => toastService.success('Angular successfully added'))
          .catch(error => {
            logger.error('Adding Angular to project failed', error);
            toastService.error('Adding Angular to project failed ' + error);
          });
      }
    };

    const addAngularWithJWT = async (): Promise<void> => {
      if (props.project.folder !== '') {
        await angularService
          .addWithJWT(toProject(props.project as ProjectToUpdate))
          .then(() => toastService.success('Angular with authentication JWT successfully added'))
          .catch(error => {
            logger.error('Adding Angular with authentication JWT to project failed', error);
            toastService.error('Adding Angular with authentication JWT to project failed ' + error);
          });
      }
    };

    return {
      selectorPrefix,
      addAngular,
      addAngularWithJWT,
      props,
    };
  },
});
