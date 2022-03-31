import { Modal, Form, Input } from 'antd'
import React, { forwardRef, memo, useImperativeHandle } from 'react'
import { useSetState } from 'ahooks'

function SetExtras(props, ref) {
	const [state, setState] = useSetState({maxExtras:0,loading:false})
	const [form] = Form.useForm()
	useImperativeHandle(ref, () => ({
    init: async (item) => {
      console.log(item)
			setState({
        visible: true,
        maxExtras: item.maxExtras - item.userExtras
      })
      if (item) {
        form.setFieldsValue({
          extras: item.userExtras,
          userExtras:item.userExtras,
          luckyNumber: item.userNumber ?? ''
        })
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
    setState({loading:true})
    console.log('payload ===>', payload)
    return
    props.refresh()
    setState({loading:false})
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
      width={800}
      loading={state.loading}
		>
			<Form form={form}  onFinish={onFinish}>
        <Form.Item
          required
          name="extras"
          label="Extras Count"
          validateTrigger={['onChange', 'onBlur']}
          rules={[
            {
              required: true,
              validateTrigger: ['onBlur'],
              validator: async (_, value) => {
                if (value) {
                  if (parseInt(value) > state.maxExtras) {
                    return Promise.reject('The selected extra exceeds the maximum limit')
                  } else if(value == '0') {
                    return Promise.reject('Must Choose at least one extra ')
                  } else {
                    return Promise.resolve()
                  }
                } else if (!value) {
                  return Promise.reject('Please select extras mount')
                }
              }
            }
          ]}>
          <input type="number" id="name_field" min="1" max={state.maxExtras} class="nes-input" />
				</Form.Item>
				<Form.Item rules={[{ required: true, message: 'Please select a lucky number' }]} name="luckyNumber" label="Lucky Number">
          <input type="number" id="name_field" min="1" class="nes-input" />
				</Form.Item>
			</Form>
		</Modal>
	)
}

export default memo(forwardRef(SetExtras))
