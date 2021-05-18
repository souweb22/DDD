import { createRandomIdString } from 'src/util/random'
import { prisma } from '@testUtil/prisma'
import { TaskGroupRepository } from '../../repository/task-group-repository'
import { TaskGroup } from 'src/domain/entity/task-group/task-group'
import { seedTaskGroup } from '@testUtil/task-group/seed-task-group'

describe('task-group-repository.integration.ts', () => {
  const taskGroupRepo = new TaskGroupRepository(prisma)
  beforeEach(async () => {
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()
  })
  afterAll(async () => {
    await prisma.task.deleteMany()
    await prisma.taskGroup.deleteMany()

    await prisma.$disconnect()
  })

  describe('findAll', () => {
    it('[正常系]taskGroupを全て取得できる', async () => {
      await seedTaskGroup({})
      await seedTaskGroup({})
      const taskGroups = await taskGroupRepo.findAll()
      taskGroups.map((taskGroup) => {
        expect(taskGroup).toEqual(expect.any(TaskGroup))
      })
    })
  })

  describe('findById', () => {
    it('[正常系]特定のidのtaskGroupを取得できる', async () => {
      await seedTaskGroup({ id: '1' })
      await seedTaskGroup({ id: '2' })

      const taskGroup = await taskGroupRepo.findById('1')
      expect(taskGroup).toEqual(expect.any(TaskGroup))
      expect(taskGroup).toEqual({
        id: '1',
        name: expect.any(String),
        tasks: expect.any(Array),
      })
    })
  })

  describe('save', () => {
    it('[正常系]taskGroupを保存できる', async () => {
      const taskGroupExpected = {
        id: createRandomIdString(),
        name: 'task1',
        tasks: [createRandomIdString(), createRandomIdString()],
      }
      await taskGroupRepo.save(new TaskGroup(taskGroupExpected))

      const taskGroups = await prisma.taskGroup.findMany()
      taskGroups.map((taskGroup) => {
        expect(taskGroup).toEqual({
          id: expect.any(String),
          name: expect.any(String),
        })
      })
    })
  })

  describe('delete', () => {
    it('[正常系]特定のidのtaskGroupを削除できる', async () => {
      await seedTaskGroup({ id: '1' })
      await seedTaskGroup({ id: '2' })

      await taskGroupRepo.delete('1')
      const taskGroups = await prisma.taskGroup.findMany()
      expect(taskGroups).toHaveLength(1)
      taskGroups.map((taskGroup) => {
        expect(taskGroup).toEqual({
          id: '2',
          name: expect.any(String),
        })
      })
    })
  })
})
