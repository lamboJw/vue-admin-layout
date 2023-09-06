import { get } from '@/utils/request'

export function previewDoc(path) {
  return get('upload/preview_doc', { path })
}
export function getAllParentGame() {
  return get('common/get_all_parent_game')
}
