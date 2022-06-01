import Cpu from '../cpu'
import adc from './adc'
import and from './and'
import asl from './asl'
import bcc from './bcc'
import bcs from './bcs'
import beq from './beq'
import bit from './bit'
import bmi from './bmi'
import bne from './bne'
import bpl from './bpl'
import brk from './brk'
import bvc from './bvc'
import bvs from './bvs'
import clc from './clc'
import cld from './cld'
import cli from './cli'
import clv from './clv'
import cmp from './cmp'
import cpx from './cpx'
import cpy from './cpy'
import dec from './dec'
import dex from './dex'
import dey from './dey'
import eor from './eor'
import inc from './inc'
import inx from './inx'
import iny from './iny'
import jmp from './jmp'
import jsr from './jsr'
import lda from './lda'
import ldx from './ldx'
import ldy from './ldy'
import lsr from './lsr'
import nop from './nop'
import ora from './ora'
import pha from './pha'
import php from './php'
import pla from './pla'
import plp from './plp'
import rol from './rol'
import ror from './ror'
import rti from './rti'
import rts from './rts'
import sbc from './sbc'
import sec from './sec'
import sed from './sed'
import sei from './sei'
import sta from './sta'
import stx from './stx'
import sty from './sty'
import tax from './tax'
import tay from './tay'
import tsx from './tsx'
import txa from './txa'
import txs from './txs'
import tya from './tya'

const bindings: StaticArray<(cpu: Cpu) => void> = [
  adc,
  and,
  asl,
  bcc,
  bcs,
  beq,
  bit,
  bmi,
  bne,
  bpl,
  brk,
  bvc,
  bvs,
  clc,
  cld,
  cli,
  clv,
  cmp,
  cpx,
  cpy,
  dec,
  dex,
  dey,
  eor,
  inc,
  inx,
  iny,
  jmp,
  jsr,
  lda,
  ldx,
  ldy,
  lsr,
  nop,
  ora,
  pha,
  php,
  pla,
  plp,
  rol,
  ror,
  rti,
  rts,
  sbc,
  sec,
  sed,
  sei,
  sta,
  stx,
  sty,
  tax,
  tay,
  tsx,
  txa,
  txs,
  tya,
]

export default bindings
