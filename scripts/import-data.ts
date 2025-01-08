import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importData() {
    function getRackNumber(rowIndex: number, colIndex: number): string {
        let baseRack = 0;
        if (rowIndex >= 0 && rowIndex < 35) {
            baseRack = 0;      // Rack 1-5
        } else if (rowIndex >= 35 && rowIndex < 87) {
            baseRack = 5;      // Rack 6-10
        } else if (rowIndex >= 87 && rowIndex < 130) {
            baseRack = 10;     // Rack 11-15
        }
        const rackOffset = Math.floor(colIndex / 2);
        return (baseRack + rackOffset + 1).toString().padStart(2, '0');
    }

    try {
        // Excel 文件就在同一目录下
        const filePath = path.join(__dirname, 'AISLEMAPPING.xlsx');
        console.log('Reading file from:', filePath);
        
        const fileContent = fs.readFileSync(filePath);
        const workbook = XLSX.read(fileContent, { type: 'buffer' });
        const sheet = workbook.Sheets["AISLE E Parts table"];
        
        if (!sheet) {
            throw new Error("Sheet 'AISLE E Parts table' not found in Excel file");
        }

        const data = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1 });
        const actualData = data.slice(2);

        // 清除现有数据
        await prisma.item.deleteMany({
            where: {
                position: {
                    startsWith: 'PE'
                }
            }
        });

        let importCount = 0;
        
        // 处理每一行数据
        for (let rowIndex = 0; rowIndex < actualData.length; rowIndex++) {
            const row = actualData[rowIndex];
            if (!row || !Array.isArray(row)) continue;

            const levelValue = row[0];
            if (!levelValue || typeof levelValue.toString() !== 'string') continue;
            const level = levelValue.toString();

            // 处理每个单元格
            for (let colIndex = 1; colIndex < row.length; colIndex++) {
                const item = row[colIndex];
                if (!item || colIndex % 2 === 0) continue; // 跳过空值和偶数列（details列）

                const rackNumber = getRackNumber(rowIndex, colIndex);
                const position = `PE-${rackNumber}-${level.padStart(2, '0')}`;

                try {
                    // 创建数据库记录
                    await prisma.item.create({
                        data: {
                            name: item.toString(),
                            position: position,
                            details: `Item located in Aisle E, Rack ${rackNumber}, Level ${level}`,
                            quantity: 0
                        }
                    });
                    
                    importCount++;
                    console.log(`Imported: ${item} at ${position}`);
                } catch (error) {
                    console.error(`Failed to import item at position ${position}:`, error);
                }
            }
        }

        console.log(`Data import completed successfully. Total items imported: ${importCount}`);
    } catch (error) {
        console.error('Error importing data:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            console.error('Stack trace:', error.stack);
        }
    } finally {
        await prisma.$disconnect();
    }
}

importData();