import { shallowMount, VueWrapper } from '@vue/test-utils';
import { ProjectToUpdate } from '@/springboot/primary/ProjectToUpdate';
import { createProjectToUpdate } from '../../ProjectToUpdate.fixture';
import { stubLogger } from '../../../../common/domain/Logger.fixture';
import { Logger } from '@/common/domain/Logger';
import { ProjectService } from '@/springboot/domain/ProjectService';
import { stubProjectService } from '../../../domain/ProjectService.fixture';
import { ProjectGeneratorVue } from '@/springboot/primary/generator/project-generator';
import { FileDownloader } from '@/common/primary/FileDownloader';
import { stubFileDownloader } from '../../../../common/primary/FileDownloader.fixture';
import { NotificationService } from '@/common/domain/NotificationService';
import { stubNotificationService } from '../../../../common/domain/NotificationService.fixture';
import { stubToastService } from '../../../../common/secondary/ToastService.fixture';

let wrapper: VueWrapper;
let component: any;

interface WrapperOptions {
  projectService: ProjectService;
  fileDownloader: FileDownloader;
  logger: Logger;
  project: ProjectToUpdate;
  toastService: NotificationService;
}

const wrap = (wrapperOptions?: Partial<WrapperOptions>) => {
  const { projectService, fileDownloader, logger, project, toastService }: WrapperOptions = {
    projectService: stubProjectService(),
    fileDownloader: stubFileDownloader(),
    logger: stubLogger(),
    project: createProjectToUpdate(),
    toastService: stubNotificationService(),
    ...wrapperOptions,
  };
  wrapper = shallowMount(ProjectGeneratorVue, {
    props: {
      project,
      buildTool: 'maven',
    },
    global: {
      provide: {
        projectService,
        fileDownloader,
        logger,
        toastService,
      },
    },
  });
  component = wrapper.vm;
};

describe('ProjectGenerator', () => {
  it('should exist', () => {
    wrap();

    expect(wrapper.exists()).toBe(true);
  });

  it('should not init project when project path is not filled', async () => {
    const projectService = stubProjectService();
    projectService.init.resolves({});
    await wrap({ projectService, project: createProjectToUpdate({ folder: '' }) });

    await component.initProject();

    expect(projectService.init.called).toBe(false);
  });

  it('should init project when project path is filled', async () => {
    const projectService = stubProjectService();
    projectService.init.resolves({});
    const toastService = stubToastService();
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate, toastService });

    await component.initProject();

    const args = projectService.init.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
    const toastMessage = toastService.success.getCall(0).args[0];
    expect(toastMessage).toBe('Project successfully initialized');
  });

  it('should handle error on init failure', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.init.rejects({});
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.initProject();

    const [message] = logger.error.getCall(0).args;
    expect(message).toBe('Project initialization failed');
  });

  it('should not add Maven when project path is not filled', async () => {
    const projectService = stubProjectService();
    projectService.addMaven.resolves({});
    await wrap({ projectService, project: createProjectToUpdate({ folder: '' }) });

    await component.addMaven();

    expect(projectService.addMaven.called).toBe(false);
  });

  it('should add Maven when project path is filled', async () => {
    const projectService = stubProjectService();
    projectService.addMaven.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.addMaven();

    const args = projectService.addMaven.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should handle error on adding maven failure', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.addMaven.rejects({});
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.addMaven();

    const [message] = logger.error.getCall(0).args;
    expect(message).toBe('Adding Maven to project failed');
  });

  it('should not add JaCoCo when project path is not filled', async () => {
    const projectService = stubProjectService();
    projectService.addJaCoCo.resolves({});
    await wrap({ projectService, project: createProjectToUpdate({ folder: '' }) });

    await component.addJaCoCo();

    expect(projectService.addJaCoCo.called).toBe(false);
  });

  it('should add JaCoCo when project path is filled', async () => {
    const projectService = stubProjectService();
    projectService.addJaCoCo.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.addJaCoCo();

    const args = projectService.addJaCoCo.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should handle error on adding JaCoCo failure', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.addJaCoCo.rejects({});
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.addJaCoCo();

    const [message] = logger.error.getCall(0).args;
    expect(message).toBe('Adding JaCoCo to project failed');
  });

  it('should not add Sonar Backend when project path is not filled', async () => {
    const projectService = stubProjectService();
    projectService.addSonarBackend.resolves({});
    await wrap({ projectService, project: createProjectToUpdate({ folder: '' }) });

    await component.addSonarBackend();

    expect(projectService.addSonarBackend.called).toBe(false);
  });

  it('should add Sonar Backend when project path is filled', async () => {
    const projectService = stubProjectService();
    projectService.addSonarBackend.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.addSonarBackend();

    const args = projectService.addSonarBackend.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should handle error on adding Sonar Backend failure', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.addSonarBackend.rejects({});
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.addSonarBackend();

    const [message] = logger.error.getCall(0).args;
    expect(message).toBe('Adding Sonar Backend to project failed');
  });

  it('should not add Sonar Backend+Frontend when project path is not filled', async () => {
    const projectService = stubProjectService();
    projectService.addSonarBackendFrontend.resolves({});
    await wrap({ projectService, project: createProjectToUpdate({ folder: '' }) });

    await component.addSonarBackendFrontend();

    expect(projectService.addSonarBackendFrontend.called).toBe(false);
  });

  it('should add Sonar Backend+Frontend when project path is filled', async () => {
    const projectService = stubProjectService();
    projectService.addSonarBackendFrontend.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.addSonarBackendFrontend();

    const args = projectService.addSonarBackendFrontend.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should handle error on adding Sonar Backend+Frontend failure', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.addSonarBackendFrontend.rejects({});
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.addSonarBackendFrontend();

    const [message] = logger.error.getCall(0).args;
    expect(message).toBe('Adding Sonar Backend+Frontend to project failed');
  });

  it('should not add JavaBase when project path is not filled', async () => {
    const projectService = stubProjectService();
    projectService.addJavaBase.resolves({});
    await wrap({ projectService, project: createProjectToUpdate({ folder: '' }) });

    await component.addJavaBase();

    expect(projectService.addJavaBase.called).toBe(false);
  });

  it('should add JavaBase when project path is filled', async () => {
    const projectService = stubProjectService();
    projectService.addJavaBase.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.addJavaBase();

    const args = projectService.addJavaBase.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should handle error on adding java base failure', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.addJavaBase.rejects({});
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.addJavaBase();

    const [message] = logger.error.getCall(0).args;
    expect(message).toBe('Adding Java Base to project failed');
  });

  it('should not add Frontend Maven Plugin when project path is not filled', async () => {
    const projectService = stubProjectService();
    projectService.addFrontendMavenPlugin.resolves({});
    await wrap({ projectService, project: createProjectToUpdate({ folder: '' }) });

    await component.addFrontendMavenPlugin();

    expect(projectService.addFrontendMavenPlugin.called).toBe(false);
  });

  it('should add Frontend Maven Plugin when project path is filled', async () => {
    const projectService = stubProjectService();
    projectService.addFrontendMavenPlugin.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.addFrontendMavenPlugin();

    const args = projectService.addFrontendMavenPlugin.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should handle error on adding Frontend Maven Plugin failure', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.addFrontendMavenPlugin.rejects({});
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.addFrontendMavenPlugin();

    const [message] = logger.error.getCall(0).args;
    expect(message).toBe('Adding Frontend Maven Plugin to project failed');
  });

  it('should download initialized project with basename', async () => {
    const projectService = stubProjectService();
    projectService.download.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.download();

    const args = projectService.download.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should download initialized project without basename', async () => {
    const projectService = stubProjectService();
    projectService.download.resolves({});
    const projectToUpdate: ProjectToUpdate = createProjectToUpdate({
      folder: 'project/path',
      baseName: 'beer',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: '8080',
    });
    await wrap({ projectService, project: projectToUpdate });

    await component.download();

    const args = projectService.download.getCall(0).args[0];
    expect(args).toEqual({
      baseName: 'beer',
      folder: 'project/path',
      projectName: 'Beer Project',
      packageName: 'tech.jhipster.beer',
      serverPort: 8080,
    });
  });

  it('should not download an non existing project', async () => {
    const logger = stubLogger();
    const projectService = stubProjectService();
    projectService.download.rejects(new Error('foo'));
    await wrap({ projectService, logger, project: createProjectToUpdate({ folder: 'project/path' }) });

    await component.download();

    const [message, error] = logger.error.getCall(0).args;
    expect(message).toBe('Downloading project failed');
    expect(error).toStrictEqual(new Error('foo'));
  });
});
