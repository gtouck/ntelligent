export const postVesselRule = {
  'info.mmsi': [{ required: true, message: '请输入船舶 IMO', trigger: 'blur' }],
  'info.name': [{ required: true, message: '请输入船舶名', trigger: 'blur' }],
  'info.ship_type': [{ required: true, message: '请输入船舶类型', trigger: 'blur' }],
  'info.build_date': [{ required: true, message: '请输入建造年份', trigger: 'blur' }],
  'info.gross_tone': [{ required: true, message: '请输入总吨', trigger: 'blur' }],
  'info.dead_weight': [{ required: true, message: '请输入载重吨', trigger: 'blur' }],
};
