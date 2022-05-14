import {Skill} from './skill.value-object';
import {SkillInvalidError} from '../errors/skill-invalid.error';

describe('Skill', () => {
  describe('create', () => {
    it('should success with proper skill name', async () => {
      // Arrange
      const skill = 'CAMERAMAN';

      // Act
      const result = Skill.create(skill);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBeInstanceOf(Skill);
      expect(result.getValue().getName()).toBe(skill);
    });

    it('should fail when skill is null', async () => {
      // Arrange
      const skill = null;

      // Act
      const result = Skill.create(skill);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.errorValue()).toBeInstanceOf(SkillInvalidError);
    });

    it('should fail when skill is undefined', async () => {
      // Arrange
      const skill = undefined;

      // Act
      const result = Skill.create(skill);

      // Assert
      expect(result.isSuccess).toBe(false);
      expect(result.errorValue()).toBeInstanceOf(SkillInvalidError);
    });

    it('should fail when skill is unknown', async () => {
      // Arrange
      const skill = 'SOME_UNKNOWN_VALUE';

      // Act
      const result = Skill.create(skill);

      //Assert
      expect(result.isSuccess).toBe(false);
      expect(result.errorValue()).toBeInstanceOf(SkillInvalidError);
    });
  });
});