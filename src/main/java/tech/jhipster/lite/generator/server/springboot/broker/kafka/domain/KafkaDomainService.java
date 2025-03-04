package tech.jhipster.lite.generator.server.springboot.broker.kafka.domain;

import static tech.jhipster.lite.common.domain.FileUtils.getPath;
import static tech.jhipster.lite.generator.project.domain.Constants.*;
import static tech.jhipster.lite.generator.project.domain.DefaultConfig.*;
import static tech.jhipster.lite.generator.server.springboot.broker.kafka.domain.Akhq.AKHQ_DOCKER_COMPOSE_FILE;
import static tech.jhipster.lite.generator.server.springboot.broker.kafka.domain.Akhq.AKHQ_DOCKER_IMAGE;
import static tech.jhipster.lite.generator.server.springboot.broker.kafka.domain.Kafka.KAFKA_DOCKER_COMPOSE_FILE;
import static tech.jhipster.lite.generator.server.springboot.broker.kafka.domain.Kafka.KAFKA_DOCKER_IMAGE;

import java.util.TreeMap;
import tech.jhipster.lite.common.domain.WordUtils;
import tech.jhipster.lite.error.domain.GeneratorException;
import tech.jhipster.lite.generator.buildtool.generic.domain.BuildToolService;
import tech.jhipster.lite.generator.buildtool.generic.domain.Dependency;
import tech.jhipster.lite.generator.docker.domain.DockerService;
import tech.jhipster.lite.generator.project.domain.DefaultConfig;
import tech.jhipster.lite.generator.project.domain.Project;
import tech.jhipster.lite.generator.project.domain.ProjectRepository;
import tech.jhipster.lite.generator.server.springboot.common.domain.SpringBootCommonService;

public class KafkaDomainService implements KafkaService {

  private static final String SOURCE = "server/springboot/broker/kafka";
  private static final String DUMMY_TOPIC_NAME = "kafka.topic.dummy";
  private static final String DUMMY_PRODUCER_PATH = "dummy/infrastructure/secondary/kafka/producer";
  private static final String DUMMY_CONSUMER_PATH = "dummy/infrastructure/primary/kafka/consumer";

  private final BuildToolService buildToolService;

  private final ProjectRepository projectRepository;

  private final SpringBootCommonService springBootCommonService;

  private final DockerService dockerService;

  public KafkaDomainService(
    final BuildToolService buildToolService,
    final ProjectRepository projectRepository,
    final SpringBootCommonService springBootCommonService,
    DockerService dockerService
  ) {
    this.buildToolService = buildToolService;
    this.projectRepository = projectRepository;
    this.springBootCommonService = springBootCommonService;
    this.dockerService = dockerService;
  }

  @Override
  public void init(final Project project) {
    addApacheKafkaClient(project);
    addDockerCompose(project);
    addProperties(project);
    addTestcontainers(project);
    addConfiguration(project);
  }

  private void addConfiguration(final Project project) {
    final String packageNamePath = project.getPackageNamePath().orElse(getPath(DefaultConfig.PACKAGE_PATH));
    final String configKafkaPath = TECHNICAL_INFRASTRUCTURE_CONFIG + "/kafka";

    projectRepository.template(project, SOURCE, "KafkaProperties.java", getPath(MAIN_JAVA, packageNamePath, configKafkaPath));
    projectRepository.template(project, SOURCE, "KafkaPropertiesTest.java", getPath(TEST_JAVA, packageNamePath, configKafkaPath));

    projectRepository.template(
      project,
      SOURCE,
      "KafkaConfiguration.java",
      getPath(MAIN_JAVA, packageNamePath, TECHNICAL_INFRASTRUCTURE_CONFIG + "/kafka")
    );
  }

  @Override
  public void addDummyProducerConsumer(final Project project) {
    if (!springBootCommonService.getProperty(project, DUMMY_TOPIC_NAME).isPresent()) {
      project.addDefaultConfig(PACKAGE_NAME);
      project.addDefaultConfig(BASE_NAME);
      final String packageNamePath = project.getPackageNamePath().orElse(getPath(DefaultConfig.PACKAGE_PATH));

      final String topicName = "queue." + project.getBaseName().orElse("jhipster") + ".dummy";
      springBootCommonService.addProperties(project, DUMMY_TOPIC_NAME, topicName);
      springBootCommonService.addPropertiesTest(project, DUMMY_TOPIC_NAME, topicName);

      projectRepository.template(project, SOURCE, "DummyProducer.java", getPath(MAIN_JAVA, packageNamePath, DUMMY_PRODUCER_PATH));
      projectRepository.template(project, SOURCE, "DummyProducerTest.java", getPath(TEST_JAVA, packageNamePath, DUMMY_PRODUCER_PATH));
      projectRepository.template(project, SOURCE, "DummyProducerIT.java", getPath(TEST_JAVA, packageNamePath, DUMMY_PRODUCER_PATH));

      projectRepository.template(project, SOURCE, "AbstractConsumer.java", getPath(MAIN_JAVA, packageNamePath, DUMMY_CONSUMER_PATH));
      projectRepository.template(project, SOURCE, "DummyConsumer.java", getPath(MAIN_JAVA, packageNamePath, DUMMY_CONSUMER_PATH));
      projectRepository.template(project, SOURCE, "DummyConsumerIT.java", getPath(TEST_JAVA, packageNamePath, DUMMY_CONSUMER_PATH));
      projectRepository.template(project, SOURCE, "DummyConsumerTest.java", getPath(TEST_JAVA, packageNamePath, DUMMY_CONSUMER_PATH));
    }
  }

  @Override
  public void addAkhq(final Project project) {
    final String akhqDockerImage = dockerService.getImageNameWithVersion(AKHQ_DOCKER_IMAGE).orElseThrow();
    project.addConfig("akhqDockerImage", akhqDockerImage);
    projectRepository.template(project, SOURCE, AKHQ_DOCKER_COMPOSE_FILE, MAIN_DOCKER, AKHQ_DOCKER_COMPOSE_FILE);
  }

  private void addApacheKafkaClient(final Project project) {
    final Dependency dependency = Dependency.builder().groupId("org.apache.kafka").artifactId("kafka-clients").build();
    buildToolService.addDependency(project, dependency);
  }

  private void addDockerCompose(final Project project) {
    final String zookeeperDockerImage = dockerService.getImageNameWithVersion(Zookeeper.ZOOKEEPER_DOCKER_IMAGE).orElseThrow();
    final String kafkaDockerImage = dockerService.getImageNameWithVersion(KAFKA_DOCKER_IMAGE).orElseThrow();

    project.addDefaultConfig(BASE_NAME);
    project.addConfig("zookeeperDockerImage", zookeeperDockerImage);
    project.addConfig("kafkaDockerImage", kafkaDockerImage);
    projectRepository.template(project, SOURCE, KAFKA_DOCKER_COMPOSE_FILE, MAIN_DOCKER, KAFKA_DOCKER_COMPOSE_FILE);
  }

  private void addProperties(final Project project) {
    final String kebabBaseName = WordUtils.kebabCase(project.getBaseName().orElse(DEFAULT_BASE_NAME));
    getKafkaCommonProperties(kebabBaseName)
      .forEach((k, v) -> {
        springBootCommonService.addProperties(project, k, v);
        springBootCommonService.addPropertiesTest(project, k, v);
      });
  }

  private TreeMap<String, Object> getKafkaCommonProperties(final String kebabBaseName) {
    final TreeMap<String, Object> result = new TreeMap<>();

    result.put("# Kafka Configuration", "");
    result.put("kafka.bootstrap-servers", "localhost:9092");
    result.put("kafka.consumer.'[key.deserializer]'", "org.apache.kafka.common.serialization.StringDeserializer");
    result.put("kafka.consumer.'[value.deserializer]'", "org.apache.kafka.common.serialization.StringDeserializer");
    result.put("kafka.consumer.'[group.id]'", kebabBaseName);
    result.put("kafka.consumer.'[auto.offset.reset]'", "earliest");
    result.put("kafka.producer.'[key.serializer]'", "org.apache.kafka.common.serialization.StringSerializer");
    result.put("kafka.producer.'[value.serializer]'", "org.apache.kafka.common.serialization.StringSerializer");
    result.put("kafka.polling.timeout", "10000");

    return result;
  }

  void addTestcontainers(final Project project) {
    final String packageNamePath = project.getPackageNamePath().orElse(getPath(DefaultConfig.PACKAGE_PATH));
    projectRepository.template(project, SOURCE, "KafkaTestContainerExtension.java", getPath(TEST_JAVA, packageNamePath));
    this.buildToolService.getVersion(project, "testcontainers")
      .ifPresentOrElse(
        version -> {
          Dependency dependency = Dependency
            .builder()
            .groupId("org.testcontainers")
            .artifactId("kafka")
            .version("\\${testcontainers.version}")
            .scope("test")
            .build();
          buildToolService.addProperty(project, "testcontainers.version", version);
          buildToolService.addDependency(project, dependency);
        },
        () -> {
          throw new GeneratorException("Testcontainers version not found");
        }
      );
    springBootCommonService.updateIntegrationTestAnnotation(project, "KafkaTestContainerExtension");
  }
}
