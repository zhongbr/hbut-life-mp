import React from 'react';
import {View} from '@tarojs/components';
import './container.scss';

export interface OriginIconsContainerProps {
    rows?: number;
    columns?: number;
    width?: string;
    height?: string;
    templateAreas?: string[][];
    rowGap: string;
    columnGap: string;
}

interface OriginIconsContainerStates {}

export function CreateGridTemplate(height: number, gridwidth: number): string[][] {
    let map = [];
    for(let i=0;i<height;i++){
        let row = [];
        for(let j=0;j<gridwidth;j++){
            row.push('.');
        }
        map.push(row);
    }
    return map;
}

export class OriginIconsContainer extends React.Component<OriginIconsContainerProps, OriginIconsContainerStates> {
    static defaultProps: OriginIconsContainerProps = {
        rows:3,
        columns:3,
        width:'90%',
        height:'90%',
        rowGap: '0',
        columnGap: '0'
    }

    constructor(props: OriginIconsContainerProps){
        super(props);
    }

    render() {
        let gridCssProperties: React.CSSProperties = {
            width: this.props.width,
            height: this.props.height,
            rowGap: this.props.rowGap,
            columnGap: this.props.columnGap,
            gridTemplateColumns: `repeat(${this.props.columns}, ${100/this.props.columns}%)`,
            gridTemplateRows: `repeat(${this.props.rows}, ${100/this.props.rows}%)`,
            gridTemplateAreas: (()=>{
                let template = '';
                this.props.templateAreas?.forEach(rows => {
                    let row = '';
                    rows.forEach(cell => row += `${cell} `);
                    template += `'${row.slice(0, row.length - 1)}'`;
                });
                return template?template:'none';
            })(),
        }
        return (
            <View className="origin-icons-container" style={gridCssProperties}>
                {this.props.children}
            </View>
        )
    }
}
