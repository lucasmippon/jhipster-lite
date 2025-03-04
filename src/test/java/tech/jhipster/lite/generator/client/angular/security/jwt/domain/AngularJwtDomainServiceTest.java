package tech.jhipster.lite.generator.client.angular.security.jwt.domain;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static tech.jhipster.lite.TestUtils.tmpProjectWithPackageJson;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import tech.jhipster.lite.UnitTest;
import tech.jhipster.lite.error.domain.GeneratorException;
import tech.jhipster.lite.generator.packagemanager.npm.domain.NpmService;
import tech.jhipster.lite.generator.project.domain.Project;
import tech.jhipster.lite.generator.project.domain.ProjectRepository;

@UnitTest
@ExtendWith(MockitoExtension.class)
class AngularJwtDomainServiceTest {

  @InjectMocks
  AngularJwtDomainService angularJwtDomainService;

  @Mock
  NpmService npmService;

  @Mock
  ProjectRepository projectRepository;

  @Test
  void shouldAddJwtAngular() {
    Project project = tmpProjectWithPackageJson();
    when(npmService.getVersion(anyString(), anyString())).thenReturn(Optional.of("0.0.0"));

    assertThatCode(() -> angularJwtDomainService.addJwtAngular(project)).doesNotThrowAnyException();
  }

  @Test
  void shouldNotAddJwtAngular() {
    Project project = tmpProjectWithPackageJson();

    assertThatThrownBy(() -> angularJwtDomainService.addJwtAngular(project)).isExactlyInstanceOf(GeneratorException.class);
  }

  @Test
  void shouldAddJwtDependencies() {
    Project project = tmpProjectWithPackageJson();
    when(npmService.getVersion(anyString(), anyString())).thenReturn(Optional.of("0.0.0"));

    angularJwtDomainService.addJwtDependencies(project);

    verify(npmService, times(1)).addDependency(any(Project.class), anyString(), anyString());
  }

  @Test
  void shouldNotAddJwtDependencies() {
    Project project = tmpProjectWithPackageJson();

    assertThatThrownBy(() -> angularJwtDomainService.addJwtDependencies(project)).isExactlyInstanceOf(GeneratorException.class);
  }

  @Test
  void shouldAddJwtFiles() {
    Project project = tmpProjectWithPackageJson();

    angularJwtDomainService.addJwtFiles(project);

    verify(projectRepository, times(1)).template(any(Project.class), anyString(), anyString(), anyString());
  }

  @Test
  void shouldAddAngularJwtFiles() {
    Project project = tmpProjectWithPackageJson();

    angularJwtDomainService.addAngularJwtFiles(project);

    verify(projectRepository, times(9)).template(any(Project.class), anyString(), anyString(), anyString());
  }
}
