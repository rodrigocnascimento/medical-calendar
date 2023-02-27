import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  /**
   * Reserved method taht will be executed before the insert row wvent
   * @param {User} event user entity that is being saved
   * @returns
   */
  async beforeInsert(event: InsertEvent<User>) {
    const entityChanged = await this.hashUserPasswordBeforeInsert(event);

    const inserEvent = {
      ...event,
      entity: entityChanged,
    };

    return inserEvent;
  }

  private async hashUserPasswordBeforeInsert(event: InsertEvent<User>) {
    const entity = event.entity;
    const hash = await bcrypt.hash(entity.password, 1_0);

    entity.password = hash;

    return entity;
  }
}
