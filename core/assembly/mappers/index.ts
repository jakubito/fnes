import NesFile from '../main/NesFile'
import Mapper from './Mapper'
import Mapper0 from './Mapper0'

function createMapper(file: NesFile): Mapper {
  switch (file.mapper) {
    case 0:
      return new Mapper0(file)
    default:
      throw new Error('Unsupported mapper: ' + file.mapper.toString())
  }
}

export default createMapper
