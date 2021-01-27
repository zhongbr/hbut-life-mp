import React from 'react'
import { request } from '../../utils/net/request'
import { View, Text } from '@tarojs/components'
import { CustomNavigationBar } from '../../components/navigation/navigation-bar'

interface CampusCardState {
    balance: number;
}

export default class CampusCardPgae extends React.Component<any, CampusCardState> {
    constructor(props: any) {
        super(props);
        this.state = {
            balance: 0
        }
    }

    async componentDidShow() {
        await this.GetCampusCardBalance();
    }

    private async GetCampusCardBalance() {
        let resp = await request({
            data: {
                group: 'campus-card',
                action: 'get-balance',
                data: {
                    accounts: ['004']
                }
            }
        });
        let balance = resp.data.balance as number;
        console.log(resp, balance);
    }

    render() {
        return <>
            <CustomNavigationBar title='校园卡' opacity={1} hasBack />
            <View>
                一卡通余额：{this.state.balance}
            </View>
        </>;
    }
}