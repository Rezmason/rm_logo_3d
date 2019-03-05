const makeLogoform = () => {
    const geometries = [[], [], [], [], [], [], []];
    const makePusher = func => (i, ...args) => geometries[i].push(func(...args));
    const [addCurve, addStraight] = [makePusher(makeCurve), makePusher(makeStraight)];

    const whatWasIThinking = Math.SQRT1_2;

    const thickness = 0.5;
    const width = 9.6 * whatWasIThinking;
    const height = 6 * whatWasIThinking;

    const xLeft = -width / 2;
    const xRight = width / 2;

    const yTop = height / 2;
    const yMiddle = 0.25 * whatWasIThinking;
    const yBottom = -height / 2;
    const rRadius = (yMiddle - yBottom) / 2 - thickness;
    const mRadius = height / 2 - thickness;

    const zBase = -0.5;
    const zFront = zBase + rRadius + thickness;
    const zBack = zBase - mRadius - thickness;

    const rSideRadius = zFront;

    // R straightforward curl
    addCurve(3,
        (yTop - yMiddle) / 2, 0, 1,
        /* POSITION */ xLeft + 2.25, (yTop + yMiddle) / 2 - thickness, zBase,
        /* ROTATION */ 0, 0, -0.5
    );

    // R top left horizontal | straight bit
    addStraight(2,
        (2.25 - rSideRadius - thickness),
        /* POSITION */ xLeft + rSideRadius + thickness, yTop - thickness, zBase,
        /* ROTATION */ 0, 0.5
    );

    // R bottom left horizontal | straight bit
    addStraight(4,
        (2.25 - rSideRadius - thickness),
        /* POSITION */ xLeft + rSideRadius + thickness, yMiddle - thickness, zBase,
        /* ROTATION */ 0, 0.5
    );

    // R bottom left horizontal | bendy bit
    addCurve(4,
        rSideRadius, 0.5, 1,
        /* POSITION */ xLeft + rSideRadius + thickness, yMiddle - thickness, zFront - thickness,
        /* ROTATION */ 1.5
    );

    // R bottom left vertical
    addStraight(0,
        yMiddle - yBottom,
        /* POSITION */ xLeft + 0.5, yMiddle, zFront,
        /* ROTATION */ 0.5, 0, 0
    );

    // R bottom left base
    addStraight(0,
        zFront - zBack - thickness * 2,
        /* POSITION */ xLeft + thickness, yBottom + thickness, zFront - thickness,
        /* ROTATION */ 0, 1
    );

    // R helix
    addCurve(5,
        rRadius, 0, 1,
        /* POSITION */ xLeft + 1 + thickness + 0.25, (yMiddle + yBottom) / 2, 0,
        /* ROTATION */ 0, 0.5, 0.5,
        t => {
          const r1 = t * 3;
          const r2 = t * 1.75;
          return t * r2 + (1 - t) * r1;
        }
    );

    // M helix
    addCurve(6,
        mRadius, 1.5, 2.5,
        0.1, 0, 0,
        0, 0.5, 0,
        t => {
          const r1 = t * 1.75;
          const r2 = t * (width / 2 - Math.SQRT1_2 + 0.1);
          return t * r2 + (1 - t) * r1;
        }
    );

    const mShootRadius = (zFront - zBack - thickness * 2) / 2;

    // M hidden shoot | curvy bit
    addCurve(1,
        mShootRadius, 0, 1,
        xRight - thickness, yBottom + thickness * 1.5, zFront - mShootRadius,
        0, 0.5, 0
    );

    // M hidden shoot | straight bit
    addStraight(1,
        thickness * 1.5,
        xRight - thickness, yBottom, zBack + thickness * 2,
        1.5
    );

    // M right vertical | bendy bit
    addCurve(1,
        rRadius, 0, 0.5,
        xRight - thickness, yTop - rRadius - thickness, 0,
        0, 0.5, 0.5
    );

    // M right vertical | straight bit
    addStraight(1,
        height - rRadius - thickness,
        xRight - thickness, height / 2 - rRadius - thickness, zFront,
        0.5, 0, 0
    );

    // R bottom left horizontal | bendy bit
    addCurve(2,
        rSideRadius, 0.5, 1,
        /* POSITION */ xLeft + rSideRadius + thickness, yTop - thickness, zBase - rSideRadius,
        /* ROTATION */ 0.5
    );

    // R top left extension | curvy bit
    addStraight(2,
        (zBase - rSideRadius) - zBack - thickness,
        /* POSITION */ xLeft + thickness, yTop - thickness, zBase - rSideRadius,
        /* ROTATION */ 0, 1
    );

    return geometries;
}
