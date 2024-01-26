import {
  Model,
  Column,
  Table,
  PrimaryKey,
  Default,
  DataType
} from 'sequelize-typescript';

@Table({timestamps: false})
export default class Project extends Model<Project> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string; // Use string type for UUID.

  @Column
  url!: string;

  @Column
  status!: string;

  @Column
  country!: string;
}
