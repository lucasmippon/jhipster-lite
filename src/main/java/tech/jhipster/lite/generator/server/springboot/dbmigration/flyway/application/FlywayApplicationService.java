package tech.jhipster.lite.generator.server.springboot.dbmigration.flyway.application;

import org.springframework.stereotype.Service;
import tech.jhipster.lite.generator.project.domain.Project;
import tech.jhipster.lite.generator.server.springboot.dbmigration.flyway.domain.FlywayService;

@Service
public class FlywayApplicationService {

  private final FlywayService flywayService;

  public FlywayApplicationService(FlywayService flywayService) {
    this.flywayService = flywayService;
  }

  public void init(Project project) {
    flywayService.init(project);
  }

  public void addUserAuthorityChangelog(Project project) {
    flywayService.addUserAuthorityChangelog(project);
  }
}
