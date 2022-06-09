import Cpu from '../Cpu'
import adc from './adc'
import alr from './alr'
import anc from './anc'
import and from './and'
import arr from './arr'
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
import dcp from './dcp'
import dec from './dec'
import dex from './dex'
import dey from './dey'
import eor from './eor'
import inc from './inc'
import inx from './inx'
import iny from './iny'
import isc from './isc'
import jmp from './jmp'
import jsr from './jsr'
import las from './las'
import lax from './lax'
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
import rla from './rla'
import rol from './rol'
import ror from './ror'
import rra from './rra'
import rti from './rti'
import rts from './rts'
import sax from './sax'
import sbc from './sbc'
import sbx from './sbx'
import sec from './sec'
import sed from './sed'
import sei from './sei'
import sha from './sha'
import shx from './shx'
import shy from './shy'
import slo from './slo'
import sre from './sre'
import sta from './sta'
import stx from './stx'
import sty from './sty'
import tas from './tas'
import tax from './tax'
import tay from './tay'
import tsx from './tsx'
import txa from './txa'
import txs from './txs'
import tya from './tya'

const bindings: StaticArray<(cpu: Cpu) => void> = [
  adc,
  alr,
  anc,
  and,
  arr,
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
  dcp,
  dec,
  dex,
  dey,
  eor,
  inc,
  inx,
  iny,
  isc,
  jmp,
  jsr,
  las,
  lax,
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
  rla,
  rol,
  ror,
  rra,
  rti,
  rts,
  sax,
  sbc,
  sbx,
  sec,
  sed,
  sei,
  sha,
  shx,
  shy,
  slo,
  sre,
  sta,
  stx,
  sty,
  tas,
  tax,
  tay,
  tsx,
  txa,
  txs,
  tya,
]

export default bindings
