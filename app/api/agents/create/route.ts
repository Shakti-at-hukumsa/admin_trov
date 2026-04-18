import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Validate required fields
    const requiredFields = [
      'businessName',
      'gstNumber',
      'officeAddress',
      'city',
      'state',
      'pincode',
      'contactPerson',
      'email',
      'phone'
    ];

    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Handle file upload if exists
    const logoFile = formData.get('logo') as File | null;
    let logoUrl = '';

    if (logoFile) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Save the file to the public directory
      const path = join(process.cwd(), 'public/uploads/agents', logoFile.name);
      await writeFile(path, buffer);
      logoUrl = `/uploads/agents/${logoFile.name}`;
    }

    // Prepare agent data
    const agentData = {
      businessName: formData.get('businessName'),
      description: formData.get('description') || '',
      gstNumber: formData.get('gstNumber'),
      officeAddress: formData.get('officeAddress'),
      city: formData.get('city'),
      state: formData.get('state'),
      pincode: formData.get('pincode'),
      contactPerson: formData.get('contactPerson'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      logoUrl
    };

    return NextResponse.json(
      { message: 'Agent created successfully', data: agentData },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error in agent creation:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}