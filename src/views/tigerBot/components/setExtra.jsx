import { Modal, Form, Input } from 'antd'
import { forwardRef, memo, useImperativeHandle } from 'react'
import { useSetState } from 'ahooks'

const rules = {
	ddCode: [{ required: true, message: '请选择数据维度编号' }],
	key: [{ required: true, message: '请输入前端Key' }],
	fieldApiParameterCode: [{ required: true, message: '请输入后端Key' }],
	name: [{ required: true, message: '请输入名称' }],
	type: [{ required: true, message: '请选择类型' }],
}
// export interface EditSetExtrasRefProps {
// 	init: (item?: defs.appCenter.ViewQueryFieldResponseDto, isHold?: boolean, apiCode?: string) => void
// }
// interface Props {
// 	refresh: () => void
// 	refreshField: (data?: defs.appCenter.ViewQueryFieldAddRequestDto) => void
// }
// interface State {
// 	visible?: boolean
// 	isEdit?: boolean
// 	isHold?: boolean
// 	treeData?: TreeData[]
// }
function SetExtras(props, ref) {
	const [state, setState] = useSetState({})
	const [form] = Form.useForm()
	useImperativeHandle(ref, () => ({
		init: async (item) => {
			setState({
				visible: true,
      })
      if (item) {
        
        form.setFieldsValue(item)
      }
		},
	}))
	const cancel = () => {
		form.resetFields()
		setState({
			visible: false,
		})
	}
	const onFinish = async (payload) => {
    const viewCode = form.getFieldValue('extras')
    console.log('payload ===>',payload)
    props.refresh()
    cancel()
	}
	return (
		<Modal
			visible={state.visible}
			title="Set Extras"
			centered
			okText="Save"
			cancelText="Cancel"
			onCancel={cancel}
			onOk={form.submit}
		>
			<Form form={form} labelCol={{ span: 7, offset: 1 }} onFinish={onFinish}>
				<Form.Item name="extras" label="Extras Count">
					<Input />
				</Form.Item>
				<Form.Item name="luckyNumber" label="Lucky Number">
					<Input />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default memo(forwardRef(SetExtras))
